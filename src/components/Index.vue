
<script setup>
import TreeView from './menu/TreeView.vue'
import MonacoEditor from './MonacoEditor.vue'
const treeData = [
  {
    id: 1,
    label: 'Root',
    children: [
      { id: 2, label: 'Child 1' },
      { id: 3, label: 'Child 2', children: [{ id: 4, label: 'Subchild' }] }
    ]
  },

  {
    id: 1,
    label: 'Root',
    children: [
      { id: 2, label: 'Child 1' },
      { id: 3, label: 'Child 2', children: [{ id: 4, label: 'Subchild' }] }
    ]
  }
]
</script>

<template>
    <div class="flex">
        <div>
            <h1>Hello Jenkins!</h1>
            <div class="w-[200px]">
                <TreeView :nodes="treeData" />
            </div>
        </div> 
        <div>
             <MonacoEditor />
        </div>
    </div>
</template>