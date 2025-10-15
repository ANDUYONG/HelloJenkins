<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject } from 'vue';


const ws = ref<WebSocket | null>(null);
const connected = ref(false);

// WebSocket 연결
function connect() {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) return;

  ws.value = new WebSocket('ws://localhost:8091/ws/overview'); // 서버 주소 확인
  ws.value.onopen = () => {
    console.log('[OverviewSocket] connected');
    connected.value = true;
  };

  ws.value.onmessage = (event) => {
    console.log('[OverviewSocket] received:', event.data);
  };

  ws.value.onclose = () => {
    console.log('[OverviewSocket] WebSocket disconnected');
    connected.value = false;
  };

  ws.value.onerror = (error) => {
    console.error('[OverviewSocket] error:', error);
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

function decodeBase64(base64String) {
  const binary = atob(base64String);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}
</script>