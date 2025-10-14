import axios from 'axios'

// 기본 axios 인스턴스 생성ddd
const http = axios.create({ 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 (예: 토큰 자동 첨부)
// api.interceptors.request.use(config => {
//   // config.headers.Authorization = `Bearer ...`
//   return config
// })

// 응답 인터셉터 (예: 에러 처리)
// api.interceptors.response.use(
//   response => response,
//   error => {
//     // 공통 에러 처리
//     return Promise.reject(error)
//   }
// )

export default http
