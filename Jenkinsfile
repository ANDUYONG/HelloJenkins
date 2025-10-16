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
		stage('Merge') {
			when {
				anyOf {
					expression { env.BRANCH_NAME.startsWith("feature/") }
					expression { env.BRANCH_NAME == "dev" }
					expression { env.BRANCH_NAME == "local" }
				}
			}
			steps {
				script {
					sendStageStatus("Merge", "RUNNING", "Merging with target branch...")

					try {
						// 병합 대상 결정
						def mergeTarget = ""
						if (env.BRANCH_NAME.startsWith("feature/")) {
							mergeTarget = "dev"
						} else if (env.BRANCH_NAME == "dev") {
							mergeTarget = "main"
						} else if (env.BRANCH_NAME == "local") {
							mergeTarget = "dev"
						}

						// mergeTarget이 있을 경우만 수행
						if (mergeTarget) {
							sh """
							git fetch origin ${mergeTarget}
							git merge origin/${mergeTarget} --no-commit --no-ff || true
							"""
							sendStageStatus("Merge", "SUCCESS", "Merged with ${mergeTarget}.")
						} else {
							sendStageStatus("Merge", "SUCCESS", "No merge required.")
						}

						sendOverview()
					} catch (e) {
						sendStageStatus("Merge", "FAILURE", e.toString())
						sendOverview()
						error("Merge failed")
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


def sendStageStatus(String stageName, String status, String command) {
    def branchName = env.BRANCH_NAME ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
	def logs = sh(script: "${command} 2>&1 | tee /dev/tty", returnStdout: true).trim()
    try {
        // sh 실행 + stdout/stderr 모두 capture
        status = "SUCCESS"
    } catch (e) {
        logs = e.toString()
        status = "FAILURE"
    }

    // 로그 안전하게 escape
    def safeLogs = logs.replace('"', '\\"')

    def payload = [
        jobName     : env.JOB_NAME,
        branch      : branchName,
        buildNumber : env.BUILD_NUMBER,
        stage       : stageName,
        status      : status,
        logs        : safeLogs
    ]

    // 외부 API 전송
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
            sh '''#!/bin/bash
                set -euo pipefail

                # 1) CSRF Crumb 가져오기
                CRUMB_JSON=$(curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" "${JENKINS_URL}crumbIssuer/api/json" || true)
                CRUMB=$(echo "$CRUMB_JSON" | sed -n 's/.*"crumb"[[:space:]]*:[[:space:]]*"\\([^"]*\\)".*/\\1/p' || true)

                # 2) ROOT_NAME, FINAL_JOB_NAME 계산
                ROOT_NAME=$(echo "$JOB_NAME" | cut -d'/' -f1)
                FINAL_JOB_NAME=$(echo "$JOB_NAME" | sed "s@^$ROOT_NAME/@$ROOT_NAME/job/@")
                BUILD="$BUILD_NUMBER"

                # 3) Pipeline Tree 가져오기
                TREE_JSON=$(curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" -H "Jenkins-Crumb:$CRUMB" \
                    "${JENKINS_URL}job/${FINAL_JOB_NAME}/${BUILD}/pipeline-overview/tree" || true)

                # 4) 각 Node 로그 가져오기
                NODE_IDS=$(echo "$TREE_JSON" | sed -n 's/.*"id"[[:space:]]*:[[:space:]]*"\\([^"]*\\)".*/\\1/p')
                LOGS_JSON="["
                FIRST=true

                for NODE in $NODE_IDS; do
                    NODE_LOG=$(curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" -H "Jenkins-Crumb:$CRUMB" \
                        "${JENKINS_URL}job/${FINAL_JOB_NAME}/${BUILD}/pipeline-overview/consoleOutput?nodeId=$NODE" || true)

                    # 로그 안의 따옴표, 역슬래시, 줄바꿈 escape
                    ESCAPED_LOG=$(printf '%s' "$NODE_LOG" | sed ':a;N;$!ba;s/\\/\\\\/g;s/"/\\"/g;s/$/\\n/g')

                    if [ "$FIRST" = true ]; then
                        LOGS_JSON="$LOGS_JSON{\\"id\\": \\"$NODE\\", \\"log\\": \\"$ESCAPED_LOG\\"}"
                        FIRST=false
                    else
                        LOGS_JSON="$LOGS_JSON, {\\"id\": \\"$NODE\\", \\"log\": \\"$ESCAPED_LOG\\"}"
                    fi
                done
                LOGS_JSON="$LOGS_JSON]"

                # 5) Payload 생성 (heredoc 사용 → JSON 표준 준수)
                PAYLOAD=$(cat <<EOF
					{
					"jobName": "$JOB_NAME",
					"buildNumber": $BUILD,
					"tree": $TREE_JSON,
					"logs": $LOGS_JSON
					}
				EOF
				)

                # 6) Payload 확인
                echo "$PAYLOAD"

                # 7) 외부 API 전송
                curl -s -X POST "${SPRING_API}/overview" \
                    -H "Content-Type: application/json" \
                    -d "$PAYLOAD" || true
            '''
        }
    } catch (err) {
        echo "Overview send failed: ${err}"
    }
}