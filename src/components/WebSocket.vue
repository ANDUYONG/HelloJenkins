<template>
  <div>
    <h2>Jenkins WebSocket 실시간 상태</h2>

    <div v-if="connected" class="status connected">연결됨 ✅</div>
    <div v-else class="status disconnected">연결 끊김 ❌</div>

    <div v-if="stages.length === 0">
      <p>빌드 데이터가 없습니다.</p>
    </div>

    <div v-else class="stages">
      <div v-for="stage in stages" :key="stage.stage" class="stage-card">
        <div class="stage-header">
          <span>{{ stage.stage }}</span>
          <span :class="stage.status.toLowerCase()">{{ stage.status }}</span>
        </div>
      </div>
    </div>

    <div class="messages">
      <h3>Log:</h3>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Stage {
  stage: string;
  status: string;
}

const ws = ref<WebSocket | null>(null);
const messages = ref<string[]>([]);
const messageToSend = ref('');
const stages = ref<Stage[]>([]);
const connected = ref(false);

// WebSocket 연결
function connect() {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) return;

  ws.value = new WebSocket('ws://localhost:8080/ws/jenkins'); // 서버 주소 확인
  ws.value.onopen = () => {
    console.log('WebSocket connected');
    connected.value = true;
    messages.value.push('Connected to server');
  };

  ws.value.onmessage = (event) => {
    console.log('Message received:', event.data);
    messages.value.push(event.data);

    // 예: 서버에서 JSON 형태로 빌드 상태 전달
    try {
      const data = JSON.parse(event.data);
      if (Array.isArray(data.stages)) {
        stages.value = data.stages;
      }
    } catch (e) {
      console.warn('JSON parsing error:', e);
    }
  };

  ws.value.onclose = () => {
    console.log('WebSocket disconnected');
    connected.value = false;
    messages.value.push('Disconnected from server');
  };

  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

// WebSocket 연결 종료
function disconnect() {
  if (ws.value) {
    ws.value.close();
    ws.value = null;
  }
}

// 화면이 열리면 바로 연결
onMounted(() => {
  connect();
});

// 컴포넌트 언마운트 시 연결 종료
onBeforeUnmount(() => {
  disconnect();
});
</script>

<style scoped>
.status {
  margin-bottom: 10px;
  font-weight: bold;
}
.connected {
  color: green;
}
.disconnected {
  color: red;
}
.stages {
  margin-top: 20px;
}
.stage-card {
  padding: 8px 12px;
  border: 1px solid #ccc;
  margin-bottom: 6px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}
.stage-header span {
  font-weight: bold;
}
.stage-header .success {
  color: green;
}
.stage-header .failed {
  color: red;
}
.stage-header .running {
  color: orange;
}
.send-message {
  margin-top: 20px;
}
.messages {
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>
