pipeline {
	agent any

	environment {
		NODE_HOME = '/Users/duyong/.nvm/versions/node/v20.19.5/bin/node'
		PATH = "${NODE_HOME}:${env.PATH}"
		SPRING_API = "http://220.89.224.199:8080/api/jenkins/"
		JOB_NAME = "${env.JOB_NAME}"
		BUILD_NUMBER = "${env.BUILD_NUMBER}"
	}

	stages {
		stage('Checkout') {
			steps {
				git branch: 'test',
                       		url: 'https://github.com/ANDUYONG/HelloJenkins.git'
			}
		}

		stage('Install Dependencies') {
			steps {
				sh 'npm install'
			}
		}

		stage('Build') {
			steps {
				sh 'npm run build'
			}
		}

		stage('Test') {
			steps {
				sh 'npm run test'
			}
		}

		stage('Deploy') {
			steps {
				echo '배포 스크립트 실행'
				// 예: 로컬 서버에서 확인
				sh 'rm -rf /Users/duyong/프로젝트/HelloJenkins/deploy/frontend/*'
				sh 'cp -r dist/* /Users/duyong/프로젝트/HelloJenkins/deploy/frontend'

			}
		}
	}

	post {
		success {
			echo "빌드 성공"
			sh """
			// 성공 이벤트 전송
			curl -X POST ${SPRING_API} \
			     -H 'Content-Type: application/json' \
			     -d '{"jobName":"${JOB_NAME}","buildNumber":${BUILD_NUMBER},"status":"SUCCESS"}'
			"""
		}
		
		failure {
			echo "빌드 실패"
			// 실패 이벤트 전송
			sh """
           		curl -X POST ${SPRING_API} \
                	     -H 'Content-Type: application/json' \
                	     -d '{"jobName":"${JOB_NAME}","buildNumber":${BUILD_NUMBER},"status":"FAILURE"}'
           		"""
		}

		always {
           		echo "빌드 완료"
           		// 필요하면 여기서 로그 전체 전송 가능
        	}
}

