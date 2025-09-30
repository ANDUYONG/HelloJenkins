<template>
  <div style="color: black">
    <h3>{{ jobName }} 빌드 #{{ buildNumber }}</h3>
    <div v-if="stages.length > 0" v-for="stage in stages" :key="stage.stage" class="stage-card">
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

// Mock 데이터 생성 함수
function generateMockData() {
  const mockStages = [
    {
      stage: 'Checkout',
      status: 'SUCCESS',
      logs: 'Checkout completed. Commit: 719afb84fd614168cef3bbb5c279aef28a5ec38b'
    },
    {
      stage: 'Install Dependencies',
      status: 'SUCCESS',
      logs: 'npm install 완료. 모든 패키지 설치됨.'
    },
    {
      stage: 'Build',
      status: 'RUNNING',
      logs: 'npm run build 실행 중...'
    },
    {
      stage: 'Test',
      status: 'PENDING',
      logs: ''
    },
    {
      stage: 'Deploy',
      status: 'PENDING',
      logs: ''
    }
  ]
  
  stages.value = mockStages
}

onMounted(() => {
  generateMockData()
})
</script>

<style scoped>
.stage-card {
  border: 1px solid #1e1e1e;
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
