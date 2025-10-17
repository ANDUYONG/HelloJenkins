<script setup>
import { ref } from 'vue';
  import LayoutArea from './components/layout/LayoutArea.vue';
// import ProcessLayout from './components/process/ProcessLayout.vue'; gg
  const user = 'duyong'
  const token = '11c033a53b7a6e967c9f1bf2c95cb262aa'
  const jenkinsUrl = ref(
    `http://${user}:${token}@localhost:9090/job/HelloJenkins-Local/job/local/42/pipeline-overview/`
  )
  const buildNumber = 42
  const iframeUrl = ref(`/api/jenkins/pipeline-overview/${buildNumber}`)
</script>

<template>
  <!-- <div class="flex w-full"> -->
  <div class="w-full">
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
div {
    background: #23272e;
    color: white;
}

.jenkins-container {
  width: 100%;
  height: 100vh; /* 화면 전체 높이 */
}

.jenkins-iframe {
  width: 100%;
  height: 100%;
}
</style>