<script setup>
<<<<<<< Updated upstream
import { ref, onMounted, provide } from 'vue'
import TreeView from './components/menu/TreeView.vue'
import MonacoEditor from './components/MonacoEditor.vue'
import GitHubAPI from './http/git-hub-api'

const treeData = ref([])

const selectedFile = ref({ decodeData: '' })
provide('selectedFile', selectedFile)

const currentEditorType = ref('javascript'); // Default to JavaScript   
const currentItem = ref({ path: '왼쪽 트리에서 파일을 선택하세요.' });
const saveNodes = ref([])
let editorInstance = null;

function onChangeItem(payload) {
  selectedFile.value = {};

  if(payload.type === 'blob') {
    currentItem.value = payload;
    if(saveNodes.value.findIndex(item => item.path === payload.path) !== -1) {
      selectedFile.value = saveNodes.value.find(item => item.path === payload.path);
    } else {
      GitHubAPI.getContent({ filePath: payload.path, branch: 'test'})
        .then(response => {
          selectedFile.value = {
            ...response.data,
            decodeData: decodeBase64(response.data.content), 
          }; // Decode base64 contentgg ㅎgdㅗ 
        })
        .catch(error => {
          selectedFile.value = {};
        });
      }
      currentEditorType.value = getLanguageByExtension(payload.fileName);
  }
}

function getLanguageByExtension(filename) {
  if(filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'vue': return 'vue'; // vue 플러그인 필요  bg
      case 'json': return 'json';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'java': return 'java';
      case 'py': return 'python';
      case 'sql': return 'sql';
      case 'xml': return 'xml';
      default: return 'plaintext';
    }
  }
  return 'plaintext';
}

function decodeBase64(base64String) {
  const binary = atob(base64String);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

function onClickItem(node) {
  selectedFile.value = {...node}
}

function onChangeValue(newVal) {
  selectedFile.value = newVal;

  if(selectedFile.value.decodeData !== undefined && saveNodes.value.findIndex(item => item.path === currentItem.value.path) === -1)
    saveNodes.value.push({ ...selectedFile.value, status: 'modified' });
}

onMounted(() => {
  // Example API call to verify setup ㅇㅇg
  GitHubAPI.getTreeList()
    .then(response => {
      treeData.value = response.data.tree; // Assuming response.data is in the correct format
    })
    .catch(error => {
      console.error('API Error:', error)
    })
})
=======
  import LayoutArea from './components/layout/LayoutArea.vue';
>>>>>>> Stashed changes
</script>

<template>
  <div class="flex w-full">
    <LayoutArea/>
  </div>
</template>