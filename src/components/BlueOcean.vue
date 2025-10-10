<template>
    <div class="flex" style="color: black">
        <div>
            <WebSocket/>
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
        <div class="mx-[20px] border-l-2 border-gray-400 h-12 mx-4"></div>
        <div class="" v-if="totalLog">
            <div class="px-[30px] my-[5px] w-[130px]" style="background-color: coral;">Total Log</div>
            <p style="color: black" v-text="totalLog"></p>
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import WebSocket from './WebSocket.vue'

const jobName = ref('MyJob')
const buildNumber = ref(0)
const stages = ref([])
const totalLog = ref('')

provide('stages', stages)
provide('totalLog', totalLog)

function stageProgress(status) {
  switch (status) {
    case 'SUCCESS': return 100
    case 'RUNNING': return 50
    case 'FAILURE': return 100
    case 'PENDING': return 0
    default: return 0
  }
}
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
