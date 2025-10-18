<script setup lang="ts">
import { ref, watch } from 'vue';
import { LogItem } from '../../provider/process-data';

export interface ProcessLogTabProps {
  item: LogItem[]
  title: string
}

const props = defineProps<ProcessLogTabProps>()

const value = ref(props.item)

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

watch(() => value, newVal => {
  console.log('newVal', newVal)
})
</script>
<template>
    <h1 class="px-[10px] py-[5px]">{{ props.title }}</h1>
    <div class="p-[10px]">
      <template v-for="{ log } in props.item">
        <span class="break-all whitespace-pre-wrap overflow-scroll">
          {{ log.data.text }}
        </span>
      </template>
    </div>
</template>