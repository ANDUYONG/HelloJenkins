<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { LogItem } from '../../provider/process-data';

export interface ProcessLogTabProps {
  item: LogItem[]
  title: string
}

const props = defineProps<ProcessLogTabProps>()

// 1. 스크롤 컨테이너에 접근하기 위한 템플릿 참조를 선언합니다.
const logWrapperRef = ref<HTMLElement | null>(null);

function decodeData(val: string) {
  // 1. URL-Safe 문자 치환: '-'를 '+'로, '_'를 '/'로 변환
  let base64String = val.replace(/-/g, '+').replace(/_/g, '/');
  
  // 2. Base64 표준 알파벳 외 모든 문자(공백, 줄바꿈, 제어 문자 등) 제거
  // Base64 유효 문자: A-Z, a-z, 0-9, +, /, = 만 허용
  base64String = base64String.replace(/[^A-Za-z0-9+/=]/g, '');

  // 3. 패딩(Padding) 추가: atob는 길이가 4의 배수가 아니면 오류를 발생시킵니다.
  while (base64String.length % 4) {
    base64String += '=';
  }

  try {
    // 4. atob를 사용하여 디코딩
    const binary = atob(base64String);
    
    // 5. UTF-8 변환 (기존 로직)
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);

  } catch (e) {
    // 디코딩 실패 시 에러를 던지지 않고 처리하여 Vue 렌더링이 멈추는 것을 방지
    console.error("Base64 디코딩 실패. 원본 입력 길이:", val.length, "정제된 문자열:", base64String, "오류:", e);
    // 로그 데이터 디코딩에 실패했음을 사용자에게 알릴 수 있는 메시지 반환
    return '\n[Base64 Decoding Failed] Invalid or corrupt log data received.';
  }
}

// 스크롤을 맨 아래로 내리는 함수
function scrollToBottom() {
  const element = logWrapperRef.value;
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

watch(() => props.item, (newVal) => {
  nextTick(scrollToBottom);
}, { deep: true, immediate: true })
</script>
<template>
    <!-- 1. 템플릿 참조(ref)를 log-content-wrapper에 연결합니다. -->
    <div class="log-content-wrapper" ref="logWrapperRef">
        <h1 class="log-title">
            {{ props.title }}
        </h1>
        <div class="log-content-area">
          <template v-for="{ log } in props.item" :key="log.data.startByte">
            <span class="log-text">
              {{ log.data.text }}
            </span>
          </template>
        </div>
    </div>
</template>
<style scoped>
.log-content-wrapper {
    /* 이 컴포넌트 자체에 스크롤바를 추가하여 sticky title을 구현 */
    height: 100%;
    overflow-y: auto; 
    display: flex;
    flex-direction: column;
}

.log-title {
    /* Sticky Header */
    position: sticky;
    top: 0;
    z-index: 10;
    /* Visual distinction: darker background and border */
    background-color: #e0e0e0; /* 밝은 회색 배경 */
    border-bottom: 1px solid #c0c0c0; /* 구분선 */
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    flex-shrink: 0; /* 줄어들지 않음 */
    /* Monospace font for log look */
    font-family: monospace; 
}

.log-content-area {
    padding: 15px;
    background-color: #fcfcfc; /* 로그 컨텐츠 배경색 (약간 다르게) */
    font-family: monospace; /* 로그는 Monospace 폰트 */
    font-size: 12px;
    color: #444; /* 로그 텍스트 색상 */
    flex-grow: 1;
    min-height: 0; /* flex-grow: 1 일 때 필요 */
}

.log-text {
    display: block; /* span 대신 block 요소처럼 동작하도록 */
    white-space: pre-wrap;
    word-break: break-all;
}
</style>
