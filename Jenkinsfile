pipeline {
	agent any

	environment {
		NODE_HOME = '/Users/duyong/.nvm/versions/node/v20.19.5/bin/node'
		PATH = "${NODE_HOME}:${env.PATH}"
		SPRING_API = "http://220.89.224.199:8080/api/jenkins/event"
		JOB_NAME = "${env.JOB_NAME}"
		BUILD_NUMBER = "${env.BUILD_NUMBER}"
	}

	stages {
		stage('Checkout') {
			steps {
				script {
					sendStageStatus("Checkout", "RUNNING", "Checkout test...")
					try {
						checkout scm
						sendStageStatus("Checkout", "SUCCESS", "Checkout completed.")
					} catch (e) {
						sendStageStatus("Checkout", "FAILURE", e.toString())
						error("Checkout filed")
					}
				}		
			}
		}

		stage('Install Dependencies') {
			steps {
				script {
					sendStageStatus("Build", "RUNNING", "npm installing...")
					try {
						sh 'npm install' // 또는 mvn package
						sendStageStatus("Build", "SUCCESS", "Successfully installed")
					} catch (e) {
						sendStageStatus("Build", "FAILURE", e.toString())
						error("Build failed")
					}
				}
			}
		}

		stage('Build') {
			steps {
				script {
					sendStageStatus("Build", "RUNNING", "npm run build")   
					try {
						sh 'npm run build' // 또는 mvn package
						sendStageStatus("Build", "SUCCESS", "Successfully builded.")
					} catch (e) {
						sendStageStatus("Build", "FAILURE", e.toString())
						error("Build failed")
					}
				}
			}
		}

		stage('Test') {
			steps {
				script {
					sendStageStatus("Test", "RUNNING", "npm run test")   
					try {
							sh 'npm run test' // 또는 mvn package
							sendStageStatus("Test", "SUCCESS", "Test Completed.")
					} catch (e) {
							sendStageStatus("Test", "FAILURE", e.toString())
							error("Test failed")
					}
				}
			}
		}

		stage('Deploy') {
			steps {
				echo '배포 스크립트 실행'
				// 예: 로컬 서버에서 확인
				script {
					sendStageStatus("Deploy", "RUNNING", "Deploying...")
					try {
						sh 'rm -rf /Users/duyong/프로젝트/HelloJenkins/deploy/frontend/*'
						sh 'cp -r dist/* /Users/duyong/프로젝트/HelloJenkins/deploy/frontend/'
						sendStageStatus("Deploy", "SUCCESS", "Successfully Deployed!!")
					} catch (e) {
						sendStageStatus("Deploy", "FAILURE", e.toString())
						error("Build failed")
					}
				}
			}
		}
	}

	post {
		success {
			echo "빌드 성공"
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
            // 최소한의 Groovy만 사용
            echo "빌드 완료 (always 블록 진입)"

            // 로그 전송
            sh """
                LOGS=\$(cat \${WORKSPACE}/jenkins-build.log || echo "No log file")
                curl -X POST ${SPRING_API} \
                    -H 'Content-Type: application/json' \
                    -d '{"jobName":"${JOB_NAME}","buildNumber":"${BUILD_NUMBER}","status":"COMPLETED","logs":"'\$LOGS'"}' || true
            """
        }
	}
}

def sendStageStatus(String stageName, String status, String logs) {
    def safeLogs = logs.replace('"', '\\"')
    sh """
        curl -X POST ${env.SPRING_API} \
            -H 'Content-Type: application/json' \
            -d '{"jobName":"${env.JOB_NAME}","buildNumber":${env.BUILD_NUMBER},"stage":"${stageName}","status":"${status}","logs":"${safeLogs}"}'
    """
}

