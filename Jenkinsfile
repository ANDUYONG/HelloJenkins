pipeline {
	agent any

	environment {
		NODE_HOME = '/Users/duyong/.nvm/versions/node/v20.19.5/bin/node'
		PATH = "${NODE_HOME}:${env.PATH}"
		SPRING_API = "http://61.81.49.136:8090/api/jenkins/event"
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
            -H 'Content-Type: application/json' \
            -d '${JsonOutput.toJson(payload)}'
    """
}

// -------------------------------
// 전체 Pipeline Overview 전송
def sendOverview() {
    try {
        def overview = sh(script: "curl -s ${env.JENKINS_URL}job/${JOB_NAME}/${BUILD_NUMBER}/wfapi/describe", returnStdout: true).trim()
        sh """
            echo '${overview}' | \
            curl -s -X POST ${env.SPRING_API}/overview \
                -H 'Content-Type: application/json' \
                -d @-
        """
    } catch (err) {
        echo "Overview send failed: ${err}"
    }
}