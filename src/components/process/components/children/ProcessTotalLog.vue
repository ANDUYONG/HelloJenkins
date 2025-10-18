<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { LogItem } from '../../provider/process-data';

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
    <div ref="logContainerRef" class="h-full min-h-0 flex flex-col">
        <h1 class="px-[10px] py-[5px]">{{ props.title }}</h1>
        <div ref="logContainerRef" class="p-[10px]">
            <span class="break-all whitespace-pre-wrap">
              {{ value }}
            </span>
        </div>
    </div>
</template>