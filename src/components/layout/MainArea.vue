<script setup lang="ts">
    import { inject, ref, watch } from 'vue'
    import MonacoEditor from '../MonacoEditor.vue'
    import type { MainArea } from './provider/LayoutDataProvider.vue';

    const data = inject<MainArea>('mainArea')
    const editor = ref<InstanceType<typeof MonacoEditor>>(null)

    function getEditorType(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'js':
            case 'ts':
            case 'jsx':
            case 'tsx':
                return 'typescript';
            case 'vue':
                return 'vue';
            case 'html':
            case 'htm':
                return 'html';
            case 'css':
            case 'scss':
            case 'less':
                return 'css';
            case 'json':
                return 'json';
            case 'md':
                return 'markdown';
            case 'xml':
                return 'xml';
            case 'yml':
            case 'yaml':
                return 'yaml';
            case 'py':
                return 'python';
            case 'java':
                return 'java';
            case 'c':
            case 'h':
                return 'c';
            case 'cpp':
            case 'cc':
            case 'cxx':
            case 'hpp':
                return 'cpp';
            case 'rb':
                return 'ruby';
            case 'go':
                return 'go';
            case 'rs':
                return 'rust';
            case 'php':
                return 'php';
            default:
                return 'plaintext'; // 기본값
        }
    }   

    watch(() => data.currentNode, newVal => editor.value.onInit())
</script>
<template>
    <h3 class="p-[8px]">{{ data.currentNode && data.currentNode.path ? data.currentNode.path.replace('/', ' > ') : '왼쪽 트리에서 파일을 선택해주세요.' }}</h3>
    <MonacoEditor
        ref="editor"
        v-model="data.currentNode.decodedData"
        :language="getEditorType"
        class="bg-[#1e1e1e] p-[5px] pt-[20px]"
    />
</template>