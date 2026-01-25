pipeline {
	agent {
		label 'hellojenkins-agent'
	}

	environment {
		// 로컬 변수 > 개발 당시의 변수
		// NODE_HOME = '/Users/duyong/.nvm/versions/node/v20.19.5/bin/node'
		// PATH = "${NODE_HOME}:${env.PATH}" 
		SPRING_API = "http://61.81.49.136:8092/api/jenkins/event"
		JOB_NAME = "${env.JOB_NAME}"
		BUILD_NUMBER = "${env.BUILD_NUMBER}"
		BRANCH_NAME = "${env.BRANCH_NAME}"

		// git url
		GIT_BASE_URL = "https://github.com/ANDUYONG/HelloJenkins/"

		// Docker 이미지 정의
		DOCKER_IMAGE_NAME = "hellojenkins-web"
		NODE_BUILD_NAME = "node:20.19.5-alpine"
		GIT_TOOL_IMAGE = "alpine/git"

		// 배포 포트 변수 및 서비스 이름 변수
        SERVICE_NAME = "${DOCKER_IMAGE_NAME}-${BRANCH_NAME}"
	}

	stages {

    	// ------------------------------- 
		stage('Checkout') {
			steps {
				script {
					try {
						if(!isUnix()) {
							checkout scm
						}
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
							if(isUnix()) {
								def fetchCmd = "docker run --rm -v \$(pwd):/git -w /git ${GIT_TOOL_IMAGE} fetch origin ${mergeTarget}"
								def mergeCmd = "docker run --rm -v \$(pwd):/git -w /git ${GIT_TOOL_IMAGE} merge origin/${mergeTarget} --no-commit --no-ff || true"
								sh """
								${fetchCmd}
								${mergeCmd}
								"""
							} else {
								// Window Powershell
								powershell """
								git fetch origin ${mergeTarget}
                                git merge origin/${mergeTarget} --no-commit --no-ff
                                if (\$LASTEXITCODE -ne 0) { git merge --abort; Write-Host "Merge Conflict or No Change" }
								"""
							}
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
		stage('Install') {
			when {
				anyOf {
					expression { env.BRANCH_NAME != null }
				}
			}
			steps {
				script {
					def cmd = "docker run --rm -v \$(pwd):/app -w /app ${NODE_BUILD_NAME} npm install"
					try {
						if(isUnix()){
							sh cmd
						} else {
							powershell "npm install"
						}
						sendOverview("SUCCESS")
					} catch (e) {
						sendOverview("FAILURE")
						error("Build failed")
					}
				}
			}
		}

    	// -------------------------------
		stage('Test') {
			steps {
				script {
					def cmd = "docker run --rm -v \$(pwd):/app -w /app ${NODE_BUILD_NAME} npm run test"
					try {
						if(isUnix()) {
							sh cmd
						} else {
							powershell "npm run build"
						}
						sendOverview("SUCCESS")
					} catch (e) {
						sendOverview("FAILURE")
						error("Build failed")
					}
				}
			}
		}

		// -------------------------------
		stage('Build') {
			steps {
				script {
					def cmd = "docker run --rm -v \$(pwd):/app -w /app ${NODE_BUILD_NAME} npm run build"
					try {
						if(isUnix()) {
							sh cmd
						} else {
							powershell "npm run build"
						}
						sendOverview("SUCCESS")
					} catch (e) {
						sendOverview("FAILURE")
						error("Build failed")
					}
				}
			}
		}

		// -------------------------------
		// stage('Image Create') {
		// 	when {
		// 		anyOf {
		// 			expression { env.BRANCH_NAME == "dev" }
		// 			expression { env.BRANCH_NAME == "main" }
		// 			expression { env.BRANCH_NAME == "local" }
		// 			expression { isUnix() == true }
		// 		}
		// 	}
		// 	steps {
		// 		script {
		// 			// 배포 포트 및 서비스 이름 결정 
		// 			def port = ""
					
		// 			if (env.BRANCH_NAME == "dev") {
		// 				port = "8081"
		// 			} else if (env.BRANCH_NAME == "main") {
		// 				port = "80"
		// 			} else if (env.BRANCH_NAME == "local") {
		// 				port = "8082"
		// 			}

		// 			echo "서비스 이름: ${env.SERVICE_NAME}"
		// 			echo "서비스 포트: ${port}"

		// 			def composeContent = readFile('docker-compose.yml') // 값을 할당

		// 			// 1. Groovy의 replaceAll 함수를 사용
        //             // 1.1. 서비스 이름/컨테이너 이름 대체 (필수)
        //             def modifiedContent = composeContent.replaceAll('SERVICE_NAME_PLACEHOLDER', env.SERVICE_NAME)
                    
        //             // 1.2. 이미지 태그 대체
        //             modifiedContent = modifiedContent.replaceAll('IMAGE_NAME_PLACEHOLDER', "${env.SERVICE_NAME}:latest")
                    
        //             // 1.3. 호스트 포트 대체
        //             modifiedContent = modifiedContent.replaceAll('HOST_PORT_PLACEHOLDER', port)
                    
        //             // 2. 수정된 내용을 다시 파일에 작성
        //             writeFile(file: 'docker-compose.yml', text: modifiedContent)

		// 			def cmd = "docker build -t ${env.SERVICE_NAME}:${BUILD_NUMBER} -f Dockerfile ."
		// 			def aliasCmd = "docker tag ${env.SERVICE_NAME}:${BUILD_NUMBER} ${env.SERVICE_NAME}:latest"
		// 			try {
		// 				sh cmd
		// 				sh aliasCmd
		// 				sendOverview("SUCCESS")
		// 			} catch (e) {
		// 				sendOverview("FAILURE")
		// 				error("Build failed")
		// 			}
		// 		}
		// 	}
		// }

    	// -------------------------------
		// stage('Deploy') {
		// 	when {
		// 		anyOf {
		// 			expression { env.BRANCH_NAME == "dev" }
		// 			expression { env.BRANCH_NAME == "main" }
		// 			expression { env.BRANCH_NAME == "local" }
		// 		}
		// 	}
		// 	steps {
		// 		script {
		// 			// 1. 기존 컨테이너를 중지하고 제거 (포트 충돌 방지 및 새 이미지로 교체)
		// 			sh "docker compose -f docker-compose.yml stop ${env.SERVICE_NAME} || true"
		// 			sh "docker compose -f docker-compose.yml rm -f ${env.SERVICE_NAME} || true"

		// 			// 2. 새로운 컨테이너를 해당 서비스 이름으로만 up 시킵니다.
		// 			def cmd = "docker compose -f docker-compose.yml up -d --force-recreate ${env.SERVICE_NAME}"
		// 			try {
		// 				if(isUnix()) {
		// 					sh cmd
		// 				} else {

		// 				}
		// 				sendOverview("SUCCESS")
		// 			} catch (e) {
		// 				sendOverview("FAILURE")
		// 				error("Build failed")
		// 			}
		// 		}
		// 	}
		// }
		stage('Deploy') {
            when {
                anyOf {
                    expression { env.BRANCH_NAME == "dev" }
                    expression { env.BRANCH_NAME == "main" } [cite: 4]
                    expression { env.BRANCH_NAME == "local" }
                }
            }
            steps {
                script {
                    def port = (env.BRANCH_NAME == "main") ? "80" : (env.BRANCH_NAME == "dev" ? "8081" : "8082") [cite: 4]
                    
                    if (isUnix()) {
                        // Linux: Docker Compose 배포
                        def composeContent = readFile('docker-compose.yml')
                        def modifiedContent = composeContent.replaceAll('SERVICE_NAME_PLACEHOLDER', env.SERVICE_NAME) [cite: 5]
                        modifiedContent = modifiedContent.replaceAll('IMAGE_NAME_PLACEHOLDER', "${env.SERVICE_NAME}:latest") [cite: 6]
                        modifiedContent = modifiedContent.replaceAll('HOST_PORT_PLACEHOLDER', port) [cite: 7]
                        writeFile(file: 'docker-compose.yml', text: modifiedContent)

                        sh "docker build -t ${env.SERVICE_NAME}:${BUILD_NUMBER} -f Dockerfile ." [cite: 8]
                        sh "docker tag ${env.SERVICE_NAME}:${BUILD_NUMBER} ${env.SERVICE_NAME}:latest"
                        sh "docker compose -f docker-compose.yml up -d --force-recreate ${env.SERVICE_NAME}" [cite: 9]
                    } else {
                        // Windows: Pure PowerShell 배포 (예시: 백그라운드 프로세스 실행)
                        powershell """
							# 1. 기존 동일 이름 서비스 종료
							pm2 delete ${env.SERVICE_NAME} 2> \$null

							# 2. 포트 환경변수를 주입하며 실행
							# (애플리케이션 코드에서 process.env.PORT를 읽어야 함)
							\$env:PORT = "${port}"
							pm2 start npm --name "${env.SERVICE_NAME}" -- start
							
							# 3. 상태 저장 (재부팅 시 자동 실행 설정이 되어있을 경우)
							pm2 sa
                        """
                    }
                    sendOverview("SUCCESS")
                }
            }
        }
	}

	// -------------------------------
	post {
		success {
			echo "Pipeline succeeded"
			if (isUnix()) {
				sh "curl -X POST ${SPRING_API} -H 'Content-Type: application/json' -d '{\"jobName\":\"${JOB_NAME}\",\"buildNumber\":\"${BUILD_NUMBER}\",\"status\":\"SUCCESS\"}'"
			} else {
				powershell "Invoke-RestMethod -Uri '${SPRING_API}' -Method Post -ContentType 'application/json' -Body (@{jobName='${JOB_NAME}'; buildNumber='${BUILD_NUMBER}'; status='SUCCESS'} | ConvertTo-Json)"
			}
			// sh """
			// # 성공 이벤트 전송
			// curl -X POST ${SPRING_API} \
			//      -H 'Content-Type: application/json' \
			//      -d '{"jobName":"${JOB_NAME}","buildNumber":"${BUILD_NUMBER}","status":"SUCCESS"}'
			// """
		}
		failure {
			echo "빌드 실패"
			if (isUnix()) {
				sh "curl -X POST ${SPRING_API} -H 'Content-Type: application/json' -d '{\"jobName\":\"${JOB_NAME}\",\"buildNumber\":\"${BUILD_NUMBER}\",\"status\":\"FAILURE\"}'" [cite: 10]
			} else {
				powershell "Invoke-RestMethod -Uri '${SPRING_API}' -Method Post -ContentType 'application/json' -Body (@{jobName='${JOB_NAME}'; buildNumber='${BUILD_NUMBER}'; status='FAILURE'} | ConvertTo-Json)"
			}
			// 실패 이벤트 전송
			// sh """
           	// 	curl -X POST ${SPRING_API} \
            //     	     -H 'Content-Type: application/json' \
            //     	     -d '{"jobName":"${JOB_NAME}","buildNumber":"${BUILD_NUMBER}","status":"FAILURE"}'
           	// 	"""
		}

		always {
            echo "빌드 완료"
            script {
                try {
                    // 1. 공통 데이터 준비: 전체 로그 가져오기 및 Base64 인코딩
                    def rawLogs = currentBuild.rawBuild.getLog(999999).join("\n")
                    def encodedLogs = rawLogs.bytes.encodeBase64().toString()

                    if (isUnix()) {
                        // --- Linux / Docker 환경 ---
                        sh """
                        curl -X POST ${SPRING_API} \
                             -H 'Content-Type: application/json' \
                             -d '{
                                 "jobName":"${JOB_NAME}",
                                 "buildNumber":"${BUILD_NUMBER}",
                                 "status":"COMPLETED",
                                 "logs":"${encodedLogs}"
                             }' || true
                        """
                    } else {
                        // --- Windows / Pure PowerShell 환경 ---
                        // PowerShell은 큰 따옴표 안에 Base64 문자열을 넣을 때 줄바꿈이 있어도 안전하게 처리합니다.
                        powershell """
                        \$payload = @{
                            jobName     = "${JOB_NAME}"
                            buildNumber = [int]"${BUILD_NUMBER}"
                            status      = "COMPLETED"
                            logs        = "${encodedLogs}"
                        } | ConvertTo-Json
                        
                        Invoke-RestMethod -Uri "${SPRING_API}" -Method Post -ContentType "application/json" -Body \$payload
                        """
                    }

                    // 2. 상세 Overview 전송 (앞서 수정한 분기 함수 호출)
                    sendOverview(env.BRANCH_STATUS ?: "COMPLETED")

                } catch (e) {
                    echo "always block 에러: ${e}"
                }
            }
        }
		// always {
		// 	echo "빌드 완료"
		// 	script {
		// 		try {
		// 			def logs = currentBuild.rawBuild.getLog(999999).join("\n")
		// 			def encodedLogs = logs.bytes.encodeBase64().toString()
		// 			sh """
		// 			curl -X POST ${SPRING_API} \
		// 				 -H 'Content-Type: application/json' \
		// 				 -d '{"jobName":"${JOB_NAME}","buildNumber":"${BUILD_NUMBER}","status":"COMPLETED","logs":"${encodedLogs}"}' || true
		// 			"""

		// 			sendOverview(env.BRANCH_STATUS)
		// 		} catch (e) {
		// 			echo "always block 에러: ${e}"
		// 		}
		// 	}
		// }
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
		if(isUnix()) {
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

					# 5) 각 Node 로그 가져오기
					NODE_IDS=\$(echo "\$TREE_JSON" | sed -n 's/.*"id"[[:space:]]*:[[:space:]]*"\\([^"]*\\)".*/\\1/p')
					LOGS_JSON="["
					FIRST=true

					for NODE in \$NODE_IDS; do
						NODE_LOG=\$(curl -s -u "\$JENKINS_USER:\$JENKINS_TOKEN" -H "Jenkins-Crumb:\$CRUMB" \
							"\${JENKINS_URL}job/\$FINAL_JOB_NAME/\$BUILD/pipeline-overview/consoleOutput?nodeId=\$NODE" || true)

						# 로그 안의 따옴표, 역슬래시, 줄바꿈 escape
						ESCAPED_LOG=\$(printf '%s' "\$NODE_LOG" | sed ':a;N;\$!ba;s/\\\\/\\\\\\\\/g;s/"/\\\\"/g;s/\$/\\\\n/g')

						if [ "\$FIRST" = true ]; then
							LOGS_JSON="\$LOGS_JSON{\\\"id\\\": \\"\$NODE\\", \\"log\\": "\$ESCAPED_LOG"}"
							FIRST=false
						else
							LOGS_JSON="\$LOGS_JSON, {\\"id\\": \\"\$NODE\\", \\"log\\": "\$ESCAPED_LOG"}"
						fi
					done
					LOGS_JSON="\$LOGS_JSON]"

					# 6) Payload 생성 (heredoc 사용 → JSON 표준 준수)
					PAYLOAD=\$(cat <<EOF
						{
							"jobName": "${env.JOB_NAME}",
							"buildNumber": ${env.BUILD_NUMBER},
							"branchName": "${env.BRANCH_NAME}",
							"status": "${status}",
							"tree": \$TREE_JSON,
							"logs": \$LOGS_JSON,
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
		} else {
			// 윈도우 PowerShell 전송 로직
            withCredentials([usernamePassword(credentialsId: 'duyong-api-token', usernameVariable: 'USER', passwordVariable: 'TOKEN')]) {
				powershell """
                    # 1. 인증 정보 및 헤더 설정
                    \$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("\$env:USER:\$env:TOKEN"))
                    \$headers = @{ Authorization = "Basic \$auth" }
                    
                    # 2. Jenkins Crumb 취득 (보안 설정 대응)
                    try {
                        \$crumbResponse = Invoke-RestMethod -Uri "${env.JENKINS_URL}crumbIssuer/api/json" -Headers \$headers
                        \$headers.Add("Jenkins-Crumb", \$crumbResponse.crumb)
                    } catch { 
                        Write-Host "CrumbIssuer not found, skipping..." 
                    }

                    # 3. 데이터 조회를 위한 URL 설정
                    \$rootName = "${env.JOB_NAME}".Split('/')[0]
                    \$finalJobName = "${env.JOB_NAME}".Replace("\$rootName/", "\$rootName/job/")
                    \$baseUrl = "${env.JENKINS_URL}job/\$finalJobName/${env.BUILD_NUMBER}"

                    # 4. 리눅스와 동일한 데이터 수집
                    # 4.1 Pipeline Tree 데이터
                    \$treeJson = Invoke-RestMethod -Uri "\$baseUrl/pipeline-overview/tree" -Headers \$headers
                    
                    # 4.2 전체 로그 데이터 및 Base64 인코딩
                    \$totalLogRaw = Invoke-RestMethod -Uri "\$baseUrl/logText/progressiveText" -Headers \$headers
                    \$base64TotalLog = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(\$totalLogRaw))

                    # 4.3 스테이지별 노드 로그 (logs 항목) 구성
                    \$logsArray = @()
                    foreach (\$nodeId in \$treeJson.id) {
                        if (\$nodeId) {
                            \$nodeLog = Invoke-RestMethod -Uri "\$baseUrl/pipeline-overview/consoleOutput?nodeId=\$nodeId" -Headers \$headers
                            \$logsArray += @{ id = "\$nodeId"; log = "\$nodeLog" }
                        }
                    }

                    # 5. 리눅스 규격과 100% 일치하는 Payload 생성
                    \$payload = @{
                        jobName     = "${env.JOB_NAME}"
                        buildNumber = [int]"${env.BUILD_NUMBER}"
                        branchName  = "${env.BRANCH_NAME}"
                        status      = "${status}"
                        tree        = \$treeJson        # 리눅스의 \$TREE_JSON 객체와 동일
                        logs        = \$logsArray       # 리눅스의 \$LOGS_JSON 배열과 동일
                        totalLog    = \$base64TotalLog  # 리눅스의 \$BASE64_TOTAL_LOG와 동일
                    } | ConvertTo-Json -Depth 10        # 객체 깊이가 깊으므로 Depth 설정 필수

                    # 6. API 전송
                    Invoke-RestMethod -Uri "${env.SPRING_API}/overview" -Method Post -ContentType "application/json" -Body \$payload
                """
            }
		}
    } catch (err) {
        echo "Overview send failed: ${err}" 
    }
}