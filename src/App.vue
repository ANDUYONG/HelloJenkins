<script setup>
import LayoutArea from './components/layout/LayoutArea.vue';
// import ProcessLayout from './components/process/ProcessLayout.vue'; gg
</script>

<template>
  <!-- <div class="flex w-full"> -->
  <div id="app" class="w-screen">
    <LayoutArea/>
    <!-- <ProcessLayout/> -->
    <!-- <div class="jenkins-container">
      <iframe
        :src="iframeUrl"
        frameborder="0"
        class="jenkins-iframe"
      ></iframe>
    </div> -->
  </div>
</template>

<style setup>
#app {
    background: #23272e;
    color: white;
}
</style>