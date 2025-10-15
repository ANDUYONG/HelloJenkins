pipeline {
	agent any

	environment {
		NODE_HOME = '/Users/duyong/.nvm/versions/node/v20.19.5/bin/node'
		PATH = "${NODE_HOME}:${env.PATH}"
		SPRING_API = "http://61.81.49.136:8091/api/jenkins/event"
		JOB_NAME = "${env.JOB_NAME}"
		BUILD_NUMBER = "${env.BUILD_NUMBER}"
		BRANCH_NAME = "${env.BRANCH_NAME}"
	}

	stages {

    	// -------------------------------
		stage('Checkout') {
			steps {
				script {
					sendStageStatus("Checkout", "RUNNING", "Checkout test...")
					try {
						checkout scm
						sendStageStatus("Checkout", "SUCCESS", "Checkout completed.")
						sendOverview()
					} catch (e) {
						sendStageStatus("Checkout", "FAILURE", e.toString())
						sendOverview()
						error("Checkout filed")
					}
				}		
			}
		}

    	// -------------------------------
		stage('Install') {
			steps {
				script {
					sendStageStatus("Build", "RUNNING", "npm installing...")
					try {
						sh 'npm install' // 또는 mvn package
						sendStageStatus("Build", "SUCCESS", "Successfully installed")
						sendOverview()
					} catch (e) {
						sendStageStatus("Build", "FAILURE", e.toString())
						sendOverview()
						error("Build failed")
					}
				}
			}
		}

    	// -------------------------------
		stage('Build') {
			steps {
				script {
					sendStageStatus("Build", "RUNNING", "npm run build")   
					try {
						sh 'npm run build' // 또는 mvn package
						sendStageStatus("Build", "SUCCESS", "Successfully builded.")
						sendOverview()
					} catch (e) {
						sendStageStatus("Build", "FAILURE", e.toString())
						sendOverview()
						error("Build failed")
					}
				}
			}
		}

    	// -------------------------------
		stage('Test') {
			steps {
				script {
					sendStageStatus("Test", "RUNNING", "npm run test")   
					try {
							sh 'npm run test' // 또는 mvn package
							sendStageStatus("Test", "SUCCESS", "Test Completed.")
							sendOverview()
					} catch (e) {
							sendStageStatus("Test", "FAILURE", e.toString())
							sendOverview()
							error("Test failed")
					}
				}
			}
		}

    	// -------------------------------
		stage('Deploy') {
			when {
				anyOf {
					branch 'dev'
					branch 'main'
				}
			}
			steps {
				echo '배포 스크립트 실행'
				// 예: 로컬 서버에서 확인
				script {
					sendStageStatus("Deploy", "RUNNING", "Deploying...")
					try {
						sh 'rm -rf /Users/duyong/프로젝트/HelloJenkins/deploy/frontend/*'
						sh 'cp -r dist/* /Users/duyong/프로젝트/HelloJenkins/deploy/frontend/'
						sendStageStatus("Deploy", "SUCCESS", "Successfully Deployed!!")
						sendOverview()
					} catch (e) {
						sendStageStatus("Deploy", "FAILURE", e.toString())
						sendOverview()
						error("Build failed")
					}
				}
			}
		}
	}

	// -------------------------------
	post {
		success {
			echo "Pipeline succeeded"
			sh """
			# 성공 이벤트 전송
			curl -X POST ${SPRING_API} \
			     -H 'Content-Type: application/json' \
			     -d '{"jobName":"${JOB_NAME}","buildNumber":"${BUILD_NUMBER}","status":"SUCCESS"}'
			"""
		}
		failure {
			echo "빌드 실패"
			// 실패 이벤트 전송
			sh """
           		curl -X POST ${SPRING_API} \
                	     -H 'Content-Type: application/json' \
                	     -d '{"jobName":"${JOB_NAME}","buildNumber":"${BUILD_NUMBER}","status":"FAILURE"}'
           		"""
		}
		always {
			echo "빌드 완료"
			script {
				try {
					def logs = currentBuild.rawBuild.getLog(999999).join("\n")
					def encodedLogs = logs.bytes.encodeBase64().toString()
					sh """
					curl -X POST ${SPRING_API} \
						 -H 'Content-Type: application/json' \
						 -d '{"jobName":"${JOB_NAME}","buildNumber":"${BUILD_NUMBER}","status":"COMPLETED","logs":"${encodedLogs}"}' || true
					"""
				} catch (e) {
					echo "always block 에러: ${e}"
				}
			}
		}
	}
}

// -------------------------------
// Stage 단위 이벤트 전송
import groovy.json.JsonOutput

def sendStageStatus(String stageName, String status, String logs) {
    def safeLogs = logs.replace('"', '\\"')
    def branchName = env.BRANCH_NAME ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
    def payload = [
        jobName     : env.JOB_NAME,
        branch      : branchName,
        buildNumber : env.BUILD_NUMBER,
        stage       : stageName,
        status      : status,
        logs        : safeLogs
    ]
    sh """
        curl -X POST ${env.SPRING_API} \
            -H "Content-Type: application/json" \
            -d '${JsonOutput.toJson(payload)}'
    """
}

// -------------------------------
// 전체 Pipeline Overview 전송  
def sendOverview() {
    try {
        withCredentials([usernamePassword(credentialsId: 'duyong-api-token', usernameVariable: 'JENKINS_USER', passwordVariable: 'JENKINS_TOKEN')]) {
			sh """
				sh '''#!/bin/bash
					set -euo pipefail # 명령이 실패, 정의되지 않은 변수를 사용, 파이프라인 중 하나라도 실패하면 전체 실패 하나라도 해당하면 스크립트 종료

					# 환경 변수
					BASE_URL="${JENKINS_URL}"

					# 1) Crumb 가져오기 (CSRF 방지)
					CRUMB_JSON=$(curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" "${BASE_URL}crumbIssuer/api/json" || true)
					# 간단 검사: JSON에 crumb 필드가 있으면 jq로 뽑고, 없으면 빈값
					if command -v jq >/dev/null 2>&1; then
						CRUMB=$(echo "$CRUMB_JSON" | jq -r '.crumb // empty')
					else
						# jq가 없으면 수동 파싱
						## crumb라는 키를 갖고 있다면 값을 반환하는 정규식
						CRUMB=$(echo "$CRUMB_JSON" | sed -n "s/.*\"crumb\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p" || true) 
					fi

					# 2) wfapi 호출 (Crumb 헤더 포함)
					OUTFILE="overview-${BUILD_NUMBER}.json"
					if [ -n "$CRUMB" ]; then
						curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" -H "Jenkins-Crumb:$CRUMB" "${JENKINS_URL}job/${JOB_NAME}/${BUILD_NUMBER}/wfapi/describe" -o "$OUTFILE" || true
					else
						# crumb가 없을 때도 시도 (crumb가 불필요한 경우)
						curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" "${JENKINS_URL}job/${JOB_NAME}/${BUILD_NUMBER}/wfapi/describe" -o "$OUTFILE" || true
					fi

					# 3) 응답 검사: 만약 파일이 HTML(즉, '<'로 시작) 이면 실패 로그 출력
					if [ -s "$OUTFILE" ]; then
						FIRST_CHAR=$(head -c 1 "$OUTFILE" | tr -d '\r\n' || true)
						if [ "$FIRST_CHAR" = "<" ]; then
							echo "Overview appears to be HTML (likely login page or 404). Dumping start of file:"
							head -n 50 "$OUTFILE" || true
						fi
					else
						echo "Overview file is empty"
					fi

					# 4) 외부 API로 전송 (실패시키지 않으려면 || true)
					curl -s -X POST "${SPRING_API}/overview" \
						-H "Content-Type: application/json" \
						-d @"$OUTFILE" || true
				'''
			"""
		}
    } catch (err) {
        echo "Overview send failed: ${err}"
    }
}