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
        @commit-deploy="onAlert"
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
import { ref } from 'vue'

const emits = defineEmits(['change-item', 'click-item'])

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
  console.log('TreeViewToggled node:', payload.node, 'Expanded:', payload.expanded);
  emits('change-item', payload.node);
  // You can add additional logic here to handle the toggle event
}

function onClickItem(node) {
  let changeItem = props.nodes.find(n => n.path === node.path);
  if(!changeItem) {
    changeItem = props.nodes.map(x => x.children).flatMap(x => x).find(n => n.path === node.path);
  }

  emits('change-item', changeItem);
  emits('click-item', node);
  // You can add additional logic here to handle the toggle event test dd
}

function onAlert() {
  if(confirm('[저장 후 배포]하시겠습니까?')) {
    isProgressVisible.value = true;
  }
}
</script>