# ----------------------------------------
# 1단계: 빌드 (Build Stage) - Node.js 환경에서 정적 파일 생성
# ----------------------------------------
FROM node:20.19.5-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
# Vue.js 프로젝트라고 가정하고 빌드 명령 사용
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