<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { JenkinsPipelineInfo } from '../provider/process-data';

const emits = defineEmits<{
  (e: 'response', data: JenkinsPipelineInfo)
}>()

const ws = ref<WebSocket | null>(null);
const connected = ref(false);

// WebSocket 연결
function connect() {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) return;

  ws.value = new WebSocket('ws://localhost:8092/ws/overview'); // 서버 주소 확인
  ws.value.onopen = () => {
    console.log('[OverviewSocket] connected');
    connected.value = true;
  };

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('[OverviewSocket] received:', data);
    emits('response', data);

    // ✅ 상태가 실패(failure)일 경우 소켓 닫기
    if (data.status === 'FAILURE') {
      console.warn('[OverviewSocket] Build failed — closing socket');
      ws.value?.close();
      ws.value = null;
      connected.value = false;
    }
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
</script>
<template>
</template>