<template>
  <div class="progress-bg flex items-center justify-start w-full h-full">
    <button class="progress-close" @click="$emit('close')" aria-label="닫기">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
    <div class="flex self-start p-[50px] text-[20px]">
      <div class="flex flex-col">

        <div style="color:black" class="mb-[5px]">
          <span style="color: green;">✔</span>
          commit & push
        </div>
        <div style="color:black">
          <span style="color: green;">✔</span>
          <span>
            Jenkins Server Websocket 연결
          </span>
          <div class="pl-[20px]" style="color:black">
            <span style="color: green;">✔</span>
            <span>
              token 인증
            </span>
          </div>
          <div class="pl-[20px]" style="color:black">
            <span style="color: green;">✔</span>
            <span>
              자동 배포 쉘스크립트 실행 중
            </span>
          </div>
          <div class="pl-[20px]" style="color:black">
            <span style="color: green;">✔</span>
            <span>
              스크립트 실행 완료
            </span>
          </div>
          <div class="pl-[20px]" style="color:black">
            <span style="color: green;">✔</span>
            <span>
              서버 재시작
            </span>
          </div>
        </div>
        <div style="color:black">
          <span style="color: green;">✔</span>
          <span>
            배포 완료
          </span>
        </div>
      </div>
      
      <div class="border-l-2 border-black h-[250px] mx-[20px]"></div>

      <div style="color:black">
        <h2></h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconMiniProgressbar from '../icons/IconMiniProgressbar.vue';
// Emits 'close' event when X is clicked
</script>

<style scoped>
.progress-bg {
  background: rgba(255,255,255,0.7);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
}
 .progress-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  color: #388bfd;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  z-index: 100;
  opacity: 1;
  visibility: visible;
}
.progress-close:hover {
  background: #23272e;
  color: #4fc3f7;
}
.progress-close svg {
  display: block;
  width: 24px;
  height: 24px;
}
</style>
