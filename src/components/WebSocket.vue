<template>
    <div>
        <template v-if="stages.length > 0">
            <div class="flex flex-col gap-[3px] w-[300px]">
                <h2 style="color: black;">
                    Spring WebSocket이 연결되었습니다.
                </h2>
                <h4 style="color: black;">
                    <a style="color: blue;" href="https://github.com/ANDUYONG/HelloJenkins/tree/test" target="_blank" rel="noopener noreferrer">
                        👉 1. 로컬환경 포트폴리오 명세서 다운로드
                    </a>
                </h4>
                                <h4 style="color: black;">
                    <a style="color: blue;" href="https://github.com/ANDUYONG/HelloJenkins/tree/test" target="_blank" rel="noopener noreferrer">
                        👉 2. GCP환경 포트폴리오 명세서 다운로드
                    </a>
                </h4>
                <h4 style="color: black;">
                    <a href="https://github.com/ANDUYONG/HelloJenkins/tree/test" target="_blank" rel="noopener noreferrer">
                        👉 👉 github repo 확인하러 가기 !
                    </a>
                </h4>
                <h3 v-if="Completed" style="color: red; background-color: burlywood;">모든 배포 과정을 완료했습니다.</h3>
                <h4 style="color: green" >-- Jenkins 배포 자동화 과정을 보여줍니다... --</h4>
            </div>
        </template>
        <template v-else>
            <h2 style="color: black;">
                WebSocket 연결 중 입니다...
                <div class="spinner"></div>
            </h2>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue';

interface Stage {
  stage: string;
  status: string;
}

const ws = ref<WebSocket | null>(null);
const messages = ref<string[]>([]);
const messageToSend = ref('');
const connected = ref(false);

const Completed = ref(false);

const stages = inject('stages', ref<any[]>([]))
const totalLog = inject('totalLog', ref(''))

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

      const deployIdx = stages.value.findIndex(x => x.stage === data.stage);
      if (deployIdx !== -1) {
        stages.value[deployIdx] = data;
      } else {
        if(stages.value.length !== 4)
            stages.value.push(data);

        if(data.status === "COMPLETED"){
            Completed.value = true
            totalLog.value = decodeBase64(data.logs)
        }
        
        // if(data.stage === null)
        //     disconnect()        
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

function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(base64String) {
  const binary = atob(base64String);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}
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
  color: #b86c6c;
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

.spinner {
  border: 4px solid rgba(0,0,0,0.1);
  border-left-color: #4f46e5; /* 원하는 색상 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
