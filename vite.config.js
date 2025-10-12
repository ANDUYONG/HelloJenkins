import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'




export default defineConfig(async () => {
  const monacoEditorPlugin = (await import('vite-plugin-monaco-editor')).default
  return {
    plugins: [
      vue(),
      vueDevTools(),
  monacoEditorPlugin.default({}),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      port: 3000, // 원하는 포트로 변경 가능
        proxy: {
        '/api': {
            target: 'http://localhost:8091',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '/api'),
          },
        },
    },
  }
})
