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
  }
})
