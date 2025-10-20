<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import type { LogItem } from '../../provider/process-data';

export interface ProcessTotalLogProps {
  value: string
  title: string
}

const props = defineProps<ProcessTotalLogProps>()

// 1. 스크롤할 div 요소를 참조하기 위한 ref 선언
const logContainerRef = ref<HTMLElement | null>(null);

const value = computed(() => {
    let text = ''
    console.log('text', text)
    return props.value
})

function decodeBase64(base64String) {
  const binary = atob(base64String);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

// 3. 스크롤을 맨 아래로 이동시키는 함수
function scrollToBottom() {
    // logContainerRef는 현재 컴포넌트 내부 요소입니다.
    // 실제 스크롤바는 이 컴포넌트를 감싸고 있는 부모(ProcessLogLayout의 div)에 있습니다.
    // 따라서, 가장 가까운 스크롤 가능한 부모를 찾아야 합니다.
    
    // .overflow-y-auto 클래스나, overflow: auto/scroll 속성을 가진 가장 가까운 부모를 찾습니다.
    const container = logContainerRef.value?.parentElement?.closest('.overflow-y-auto');

    if (container) {
        // scrollHeight: 콘텐츠의 실제 전체 높이
        // scrollTop을 scrollHeight로 설정하면 맨 아래로 스크롤됩니다.
        container.scrollTop = container.scrollHeight;
    } else {
        // 디버깅용: 스크롤 컨테이너를 찾지 못했을 경우
        console.warn("Scroll container not found. Check if ProcessLogLayout.vue still has 'overflow-y-auto' on the slot wrapper.");
    }
}

watch(value, (newValue, oldValue) => {
    // 값이 실제로 변경되었는지 확인
    if (newValue !== oldValue) {
        // nextTick을 사용하여 Vue가 DOM을 업데이트한 후에 스크롤 실행
        nextTick(() => {
            scrollToBottom();
        });
    }
});
</script>
<template>
    <div class="log-content-wrapper">
        <h1 class="log-title">
            {{ props.title }}
        </h1>
        <div ref="logContainerRef" class="log-content-area-total h-screen">
            <span class="log-text">
              {{ value }}
            </span>
        </div>
    </div>
</template>
<style scoped>
.log-content-wrapper {
    /* 이 컴포넌트 전체가 Card 안에 들어가며, 로그 컨텐츠만 스크롤되도록 설정 */
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

.log-content-area-total {
    flex-grow: 1; /* 남은 공간을 채움 */
    overflow-y: auto; /* 이 영역에 스크롤바 적용 */
    padding: 25px;
    background-color: #fcfcfc; /* 로그 컨텐츠 배경색 (약간 다르게) */
    font-family: monospace; /* 로그는 Monospace 폰트 */
    font-size: 12px;
    color: #444; /* 로그 텍스트 색상 */
}

.log-text {
    display: block;
    white-space: pre-wrap;
    word-break: break-all;
}
</style>