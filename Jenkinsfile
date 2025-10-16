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
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

def sendOverview() {
    try {
        withCredentials([usernamePassword(credentialsId: 'duyong-api-token', usernameVariable: 'JENKINS_USER', passwordVariable: 'JENKINS_TOKEN')]) {
            def rootName = sh(script: "echo \"$JOB_NAME\" | cut -d'/' -f1", returnStdout: true).trim()
            def finalJobName = sh(script: "echo \"$JOB_NAME\" | sed \"s@^${rootName}/@${rootName}/job/@\"", returnStdout: true).trim()

            // 1) Tree 데이터 가져오기
            def TREE_JSON_RAW = sh(
                script: """
                    curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" \
                         "${JENKINS_URL}job/${finalJobName}/${BUILD_NUMBER}/pipeline-overview/tree"
                """,
                returnStdout: true
            ).trim()

            def TREE_JSON = new JsonSlurper().parseText(TREE_JSON_RAW)
            def logsList = []

            // 2) 각 Node 로그 가져오기
            TREE_JSON.data.stages.each { stage ->
                def nodeId = stage.id
                def nodeLog = sh(
                    script: """
                        curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" \
                             "${JENKINS_URL}job/${finalJobName}/${BUILD_NUMBER}/pipeline-overview/consoleOutput?nodeId=$nodeId"
                    """,
                    returnStdout: true
                ).trim()
                logsList << [id: nodeId, log: nodeLog]
            }

            // 3) Safe JSON 변환
            def json = JsonOutput.toJson([
                jobName: JOB_NAME,
                buildNumber: BUILD_NUMBER,
                tree: new JsonSlurper().parseText(TREE_JSON_RAW), // 구조 그대로
                logs: logsList
            ])

            // 4) 출력 및 전송
            sh """
                echo '${json}'
                curl -s -X POST "${env.SPRING_API}/overview" \
                    -H "Content-Type: application/json" \
                    -d '${json}'
            """
        }
    } catch (err) {
        echo "Overview send failed: ${err}"
    }
}