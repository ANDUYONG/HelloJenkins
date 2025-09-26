<script setup>
import { ref, onMounted } from 'vue'
import TreeView from './components/menu/TreeView.vue'
import MonacoEditor from './components/MonacoEditor.vue'
import GitHubAPI from './http/git-hub-api'

const treeData = ref([
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
])

onMounted(() => {
  // Example API call to verify setup
  GitHubAPI.getTreeList()
    .then(response => {
      console.log('API Response:', response.data)
      treeData.value = response.data.tree; // Assuming response.data is in the correct format
    })
    .catch(error => {
      console.error('API Error:', error)
    })
})
</script>

<template>
  <div class="flex w-full h-screen min-h-screen">
    <aside class="w-[260px] px-[10px] bg-[#23272e] flex-shrink-0 flex flex-col">
      <h2>Hello Jenkins!</h2>
      <TreeView :nodes="treeData" />
    </aside>
  <main class="min-w-0 h-full bg-[#1e1e1e]">
      <MonacoEditor />
    </main>
  </div>
</template>

<style scoped>
/* html, body, #app {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #1e1e1e;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}
h2 {
  color: #c9d1d9;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 18px;
  letter-spacing: -0.5px;
} */
</style>
