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
    automaticLayout: true
  })
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
