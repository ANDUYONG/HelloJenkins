pipline {
	agent any

	environment {
		NODE_HOME = '/Users/duyong/.nvm/versions/node/v20.19.5/bin/node'
		PATH = "${NODE_HOME}:${env.PATH}"
	}

	stages {
		stage('Checkout') {
			git branch: 'test',
			url: 'https://github.com/ANDUYONG/HelloJenkins.git'
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
				# 예: 로컬 서버에서 확인
				sh 'rm -rf /Users/duyong/프로젝트/HelloJenkins/deploy/frontend/*'
				sh 'cp -r dist/* /Users/duyong/프로젝트/HelloJenkins/deploy/frontend'

			}
		}
	}
}

