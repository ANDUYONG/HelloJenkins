<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto">
      <TreeNode
        v-for="node in nodes"
        :key="node.sha || node.fileName || node.path"
        :node="node"
        @toggle="onChangeItem"
      />
    </div>
    <div class="flex-shrink-0 w-[300px] h-[200px] mx-auto mt-2">
      <SaveView 
        :nodes="saveNodes" 
        @commit-deploy="onCommit"
        @click-item="onClickItem"
      />
    </div>
  </div>
  <Progress v-if="isProgressVisible" @close="isProgressVisible = false"/>
</template>

<script setup>
import TreeNode from './TreeNode.vue'
import SaveView from './SaveView.vue'
import Progress from '../dialog/Progress.vue'
import { ref, provide } from 'vue'
import GitHubAPI from '@/http/git-hub-api'

const emits = defineEmits(['change-item', 'click-item'])

const message = ref('')
provide('message', message)

const props = defineProps({
  nodes: {
    type: Array,
    required: true
  },
  saveNodes: {
    type: Array,
    required: true
  }
})

const isProgressVisible = ref(false);

function onChangeItem(payload) {
  emits('change-item', payload.node);
}

function onClickItem(node) {
  let changeItem = props.nodes.find(n => n.path === node.path);
  if(!changeItem) {
    changeItem = props.nodes.map(x => x.children).flatMap(x => x).find(n => n.path === node.path);
  }

  emits('change-item', changeItem);
  emits('click-item', node);
  // You can add additional logic here to handle the toggle event test dd 333
}

function onCommit() {
  if(message.value.length === 0) {
    return alert('커밋 메세지를 입력하세요.')
  }
  else if(props.saveNodes.length === 0) {
    return alert('수정된 파일이 없습니다.')
  }

  if(confirm('[저장 후 배포]하시겠습니까?')) {
      const saveData = props.saveNodes.map(item => {
        return {
          ...item,
          message: message.value,
          encodedData: btoa(item.decodeData) // Encode to base64 test
        }
      })
      GitHubAPI.commitContent(saveData).then(response => {
        alert('커밋 및 배포가 완료되었습니다.');
        isProgressVisible.value = true;
      })
      .catch(error => {
        alert('커밋 및 배포 중 오류가 발생했습니다. 다시 시도해주세요.');
      });

  }
}
</script>