<template>
  <div class="monaco-container absolute inset-0" ref="container" style="isolation:isolate;"></div>
</template>

<script setup>
import { onMounted, ref, watch, inject } from 'vue'
const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue', 'changeValue']);
let editorInstance = null;
const selectedFile = inject('selectedFile')
const container = ref(null)

onMounted(async () => {
  const monaco = await import('monaco-editor')
  editorInstance = monaco.editor.create(container.value, {
    value: props.modelValue || '',
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
    // --------- 여기서 기능 비활성화 ---------
    minimap: { enabled: false },       // 미니맵 제거
    suggestOnTriggerCharacters: false, // 자동완성 끄기
    quickSuggestions: false,           // 빠른 제안 끄기
    parameterHints: { enabled: false },// 파라미터 힌트 끄기
    wordBasedSuggestions: false,       // 단어 기반 자동완성 끄기
    formatOnPaste: false,              // 붙여넣기 시 자동 포맷 끄기
    formatOnType: false,               // 입력 시 자동 포맷 끄기
    hover: { enabled: false },         // 마우스 오버 툴팁 끄기
    links: false                       // 링크 자동 감지 끄기

  })
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true, // 의미(semantic) 검사 끄기
    noSyntaxValidation: true    // 문법(syntax) 검사 끄기
  });
  editorInstance.onDidChangeModelContent(() => {
    const val = editorInstance.getValue();
    emits('update:modelValue', val);
    if (selectedFile.value.decodeData) selectedFile.value.decodeData = val;
  });
})

watch(() => props.modelValue, (newVal, oldValue) => {
  if (editorInstance && editorInstance.getValue() !== newVal) {
    editorInstance.setValue(newVal || '');
  }
  if (oldValue && oldValue !== newVal) {
    selectedFile.value.decodeData = newVal;
    emits('changeValue', selectedFile.value);
  }
});
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
