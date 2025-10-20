<template>
  <div class="w-full h-full relative">
    <div ref="container" class="absolute inset-0 w-full h-full"></div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

interface MonacoEditorProps {
  modelValue: string
}

const props = defineProps<MonacoEditorProps>();
const emits = defineEmits(['update:modelValue']);
let editorInstance = null;
const container = ref(null)

async function onInit() {
  try {
    const monaco = await import('monaco-editor')

    if (editorInstance) {
      editorInstance.dispose()
      editorInstance = null
    }

    editorInstance = monaco.editor.create(container.value, {
      value: props.modelValue || '',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      parameterHints: { enabled: false },
      wordBasedSuggestions: 'off',
      formatOnPaste: false,
      formatOnType: false,
      hover: { enabled: false },
      links: false,
    })

    // 에디터 입력 시 emit
    editorInstance.onDidChangeModelContent(() => {
      const value = editorInstance.getValue()
      emits('update:modelValue', value)
    })

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    })
  } catch (err) {
    if (err && err.message === 'Canceled') {
      // Monaco 내부 cancel → 무시 가능
      return
    }
    console.error('Monaco initialization failed:', err)
  }
}

defineExpose({ onInit })
</script>

<style scoped>
.monaco-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
  /* absolute와 inset-0은 Tailwind에서 처리 */
}
</style>
