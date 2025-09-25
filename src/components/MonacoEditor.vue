ㅇ소<template>
  <div class="monaco-container absolute inset-0" ref="container" style="isolation:isolate;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
let editorInstance = null
const container = ref(null)

onMounted(async () => {
  const monaco = await import('monaco-editor')
  editorInstance = monaco.editor.create(container.value, {
    value: `function hello() {\n  console.log('Hello, Monaco!');\n}`,
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true
  })
})
</script>

<style scoped>
.monaco-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  isolation: isolate;
  /* absolute와 inset-0은 Tailwind에서 처리 */
}
</style>
