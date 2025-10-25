pipeline {
	agent {
		label 'hellojenkins-agent'
	}

	environment {
		// 로컬 변수 > 개발 당시의 변수
		// NODE_HOME = '/Users/duyong/.nvm/versions/node/v20.19.5/bin/node'
		// PATH = "${NODE_HOME}:${env.PATH}" 
		SPRING_API = "http://localhost:8092/api/jenkins/event"
		JOB_NAME = "${env.JOB_NAME}"
		BUILD_NUMBER = "${env.BUILD_NUMBER}"
		BRANCH_NAME = "${env.BRANCH_NAME}"

		// git url
		GIT_BASE_URL = "https://github.com/ANDUYONG/HelloJenkins/"

		// Docker 이미지 정의
		DOCKER_IMAGE_NAME = "hellojenkins-web"
		NODE_BUILD_NAME = "node:20.19.5-alpine"
		GIT_TOOL_IMAGE = "alpine/git"
	}

	stages {

    	// ------------------------------- 
		stage('Checkout') {
			steps {
				script {
					try {
						sendOverview("SUCCESS")
					} catch(e) {
						sendOverview("FAILURE")
						error("Checkout failed: ${e}")
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
					try {
						def mergeTarget = ""
						if (env.BRANCH_NAME.startsWith("feature/")) {
							mergeTarget = "dev"
						} else if (env.BRANCH_NAME == "dev") {
							mergeTarget = "main"
						} else if (env.BRANCH_NAME == "local") {
							mergeTarget = "dev"
						}

						// git 명령어를 Docker 컨테이너 내에서 실행
						if (mergeTarget) {
							def fetchCmd = "docker run --rm -v \$(pwd):/git -w /git ${GIT_TOOL_IMAGE} fetch origin ${mergeTarget}"
							def mergeCmd = "docker run --rm -v \$(pwd):/git -w /git ${GIT_TOOL_IMAGE} merge origin/${mergeTarget} --no-commit --no-ff || true"
							sh """
							${fetchCmd}
							${mergeCmd}
							"""
						}

						sendOverview("SUCCESS")
					} catch(e) {
						sendOverview("FAILURE")
						error("Merge failed: ${e}")
					}
				}
			}
		}

		// -------------------------------
		stage('Image Create') {
			when {
				anyOf {
					expression { env.BRANCH_NAME == "dev" }
					expression { env.BRANCH_NAME == "main" }
					expression { env.BRANCH_NAME == "local" } // local 브랜치도 테스트를 위해 이미지 생성 허용
				}
			}
			steps {
				script {
					def targetImageName = "${DOCKER_IMAGE_NAME}-${BRANCH_NAME}"
					def latestTag = "${targetImageName}:latest"

					// 1. docker-compose.yml 파일 내의 IMAGE_NAME_PLACEHOLDER를 실제 이미지 이름으로 치환
					// Mac에서는 sed -i '' 's/.../...' 형식이 필요합니다.
					sh "sed -i '' 's|IMAGE_NAME_PLACEHOLDER|${latestTag}|g' docker-compose.yml"

					// 2. Docker 빌드 명령어에 캐시 활용 옵션 추가
					// 이전의 :latest 이미지를 캐시 소스로 사용
					def buildCmd = "docker build --cache-from ${latestTag} -t ${targetImageName}:${BUILD_NUMBER} -f Dockerfile ."
					def tagCmd = "docker tag ${targetImageName}:${BUILD_NUMBER} ${latestTag}"
					
					try {
                        echo "Building Docker image with cache from ${latestTag}..."
						sh buildCmd
                        echo "Tagging image as ${latestTag} for future caching..."
						sh tagCmd
						sendOverview("SUCCESS")
					} catch (e) {
						sendOverview("FAILURE")
						error("Image Create failed: ${e}")
					}
				}
			}
		}

    	// -------------------------------
		stage('Deploy') {
			when {
				anyOf {
					expression { env.BRANCH_NAME == "dev" }
					expression { env.BRANCH_NAME == "main" }
				}
			}
			steps {
				script {
					def cmd = "docker compose -f docker-compose.yml up -d --force-recreate"
					try {
						sh cmd
						sendOverview("SUCCESS")
					} catch (e) {
						sendOverview("FAILURE")
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

					sendOverview(env.BRANCH_STATUS)
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

// -------------------------------
// 전체 Pipeline Overview 전송 
def sendOverview(String status) {
	env.BRANCH_NAME = env.BRANCH_NAME ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
	env.BRANCH_STATUS = status
    try {
        withCredentials([usernamePassword(credentialsId: 'duyong-api-token', usernameVariable: 'JENKINS_USER', passwordVariable: 'JENKINS_TOKEN')]) {
            sh """#!/bin/bash
                set -euo pipefail

                # 1) CSRF Crumb 가져오기
                CRUMB_JSON=\$(curl -s -u "\$JENKINS_USER:\$JENKINS_TOKEN" "\${JENKINS_URL}crumbIssuer/api/json" || true)
                CRUMB=\$(echo "\$CRUMB_JSON" | sed -n 's/.*"crumb"[[:space:]]*:[[:space:]]*"\\([^"]*\\)".*/\\1/p' || true)

                # 2) ROOT_NAME, FINAL_JOB_NAME 계산
                ROOT_NAME=\$(echo "${env.JOB_NAME}" | cut -d'/' -f1)
                FINAL_JOB_NAME=\$(echo "${env.JOB_NAME}" | sed "s@^\$ROOT_NAME/@\$ROOT_NAME/job/@")
                BUILD="${env.BUILD_NUMBER}"

                # 3) Pipeline Tree 가져오기
                TREE_JSON=\$(curl -s -u "\$JENKINS_USER:\$JENKINS_TOKEN" -H "Jenkins-Crumb:\$CRUMB" \
                    "\${JENKINS_URL}job/\$FINAL_JOB_NAME/\$BUILD/pipeline-overview/tree" || true)

                # 4) 전체 빌드 로그 조회 및 Base64 인코딩
                TOTAL_LOG_RAW=\$(curl -s -u "\$JENKINS_USER:\$JENKINS_TOKEN" -H "Jenkins-Crumb:\$CRUMB" \
                    "\${JENKINS_URL}job/\$FINAL_JOB_NAME/\$BUILD/logText/progressiveText")

                # 4.1) Base64 인코딩: 줄바꿈 문자를 제거하지 않고 인코딩하여 안전하게 처리
                # Mac/BSD base64와 GNU/Linux base64는 옵션이 다를 수 있으므로, pipe를 통해 처리
                BASE64_TOTAL_LOG=\$(printf '%s' "\$TOTAL_LOG_RAW" | base64)

                # 5) Payload 생성 (heredoc 사용 → JSON 표준 준수)
                PAYLOAD=\$(cat <<EOF
                    {
                        "jobName": "${env.JOB_NAME}",
                        "buildNumber": ${env.BUILD_NUMBER},
                        "branchName": "${env.BRANCH_NAME}",
                        "status": "${status}",
                        "tree": \$TREE_JSON,
                        "totalLog": "\$BASE64_TOTAL_LOG"
                    }
                EOF
                )

                # 6) Payload 확인
                #echo "==============================="
                #echo "\$PAYLOAD"
                #echo "==============================="

                # 7) 외부 API 전송
                curl -X POST "${env.SPRING_API}/overview" \
                    -H "Content-Type: application/json" \
                    -d "\$PAYLOAD" || true
            """
        }
    } catch (err) {
        echo "Overview send failed: ${err}" 
    }
}