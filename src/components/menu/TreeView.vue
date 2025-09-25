
<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto">
      <TreeNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
      />
    </div>
    <div class="flex-shrink-0 w-[300px] h-[200px] mx-auto mt-2">
      <SaveView 
        :nodes="demoSaveNodes" 
        @commit-deploy="onAlert"
        />
    </div>
  </div>
  <Progress v-if="isProgressVisible" @close="isProgressVisible = false"/>
</template>

<script setup>
import TreeNode from './TreeNode.vue'
import SaveView from './SaveView.vue'
import Progress from '../dialog/Progress.vue'
import { ref } from 'vue'
const demoSaveNodes = [
  { path: 'src/App.vue', status: 'modified' },
  { path: 'src/components/MonacoEditor.vue', status: 'added' },
  { path: 'src/assets/main.css', status: 'deleted' }
]
const props = defineProps({
  nodes: {
    type: Array,
    required: true
  }
})

const isProgressVisible = ref(false);

function onAlert() {
  if(confirm('[저장 후 배포]하시겠습니까?')) {
    isProgressVisible.value = true;
    // Simulate a delay for demonstration purposes
    // setTimeout(() => {
    //   isProgressVisible.value = false;
    //   alert('배포가 완료되었습니다.');
    // }, 3000); // 3 seconds delay
  }
}
</script>