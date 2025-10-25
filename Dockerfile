# ----------------------------------------
# 1단계: 빌드 (Build Stage) - Node.js 환경에서 정적 파일 생성
# ----------------------------------------
# 1. Builder Stage: 의존성 설치 및 빌드를 수행하는 단계 (캐싱 최적화)
# 'node:20.19.5-alpine' 이미지를 사용하여 빌드 환경을 설정
FROM node:20.19.5-alpine AS builder

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 캐싱을 위한 핵심 단계: package.json과 lock 파일을 먼저 복사
# 이 두 파일이 변경되지 않으면 npm install 레이어가 캐시
COPY package.json package-lock.json ./

# 의존성 설치. 이 단계가 캐시 히트되면 빌드 시간이 크게 단축
RUN npm install

# 나머지 모든 소스 코드를 복사합니다.
# 소스 코드가 변경되면 이 레이어 이후의 모든 레이어는 다시 빌드
COPY . .

# 테스트 실행 (선택 사항: 빌드 전에 테스트를 실행하여 실패를 조기에 감지)
# 빌드 캐시를 활용하되, 테스트 코드가 변경되면 재실행
RUN npm run test

# 프로덕션 빌드 실행
RUN npm run build

# ----------------------------------------
# 2단계: 최종 (Production Stage) - Nginx 환경에서 정적 파일 서빙
# ----------------------------------------
# Nginx를 기반 이미지로 사용
FROM nginx:1.29.1-alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 Vue.js 정적 파일을 Nginx 웹 루트로 복사
COPY dist /usr/share/nginx/html

# 80 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]