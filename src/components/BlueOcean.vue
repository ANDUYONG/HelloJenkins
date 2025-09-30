<template>
  <div>
    <h3>{{ jobName }} 빌드 #{{ buildNumber }}</h3>
    <div v-for="stage in stages" :key="stage.stage" class="stage-card">
      <div class="stage-header">
        <span>{{ stage.stage }}</span>
        <span :class="stage.status.toLowerCase()">{{ stage.status }}</span>
      </div>
      <pre class="stage-log">{{ stage.logs }}</pre>
      <div class="progress-bar">
        <div class="progress" :style="{ width: stageProgress(stage.status) + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const jobName = ref('MyJob')
const buildNumber = ref(0)
const stages = ref([])

function stageProgress(status) {
  switch (status) {
    case 'SUCCESS': return 100
    case 'RUNNING': return 50
    case 'FAILURE': return 100
    case 'PENDING': return 0
    default: return 0
  }
}

onMounted(() => {
  const eventSource = new EventSource('/api/jenkins/stream')
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    buildNumber.value = data.buildNumber
    const idx = stages.value.findIndex(s => s.stage === data.stage)
    if(idx >= 0) {
      stages.value[idx] = data
    } else {
      stages.value.push(data)
    }
  }
})
</script>

<style scoped>
.stage-card {
  border: 1px solid #ccc;
  margin: 10px 0;
  padding: 8px;
  border-radius: 6px;
}
.stage-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.stage-log {
  background: #1e1e1e;
  color: #fff;
  padding: 6px;
  overflow-x: auto;
  max-height: 120px;
}
.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-top: 4px;
}
.progress {
  height: 6px;
  background: #4caf50;
  border-radius: 3px;
}
.running { color: orange; }
.success { color: green; }
.failure { color: red; }
.pending { color: gray; }
</style>
