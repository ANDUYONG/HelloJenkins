<script setup lang="ts">
    const data = `
    6:21:49 PM [vite] (client) Pre-transform error: At least one <template> or <script> is required in a single file component. /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessTotalStatus.vue
  Plugin: vite:vue
  File: /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessTotalStatus.vue
6:21:49 PM [vite] (client) Pre-transform error: At least one <template> or <script> is required in a single file component. /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessStatus.vue
  Plugin: vite:vue
  File: /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessStatus.vue
6:21:49 PM [vite] Internal server error: At least one <template> or <script> is required in a single file component. /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessStatus.vue
  Plugin: vite:vue
  File: /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessStatus.vue
      at Object.parse$1 [as parse] (/Users/duyong/프로젝트/HelloJenkins/frontend/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js:1871:7)
      at createDescriptor (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:79:42)
      at transformMain (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:1633:33)
      at TransformPluginContext.handler (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:2045:27)
      at file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite-plugin-inspect/dist/shared/vite-plugin-inspect.BzUKaD4x.mjs:403:26
      at hook.handler (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite-plugin-inspect/dist/shared/vite-plugin-inspect.BzUKaD4x.mjs:376:14)
      at EnvironmentPluginContainer.transform (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite/dist/node/chunks/dep-Bm2ujbhY.js:30984:51)
      at async loadAndTransform (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite/dist/node/chunks/dep-Bm2ujbhY.js:26116:26)
6:21:49 PM [vite] Internal server error: At least one <template> or <script> is required in a single file component. /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessTotalStatus.vue
  Plugin: vite:vue
  File: /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessTotalStatus.vue
      at Object.parse$1 [as parse] (/Users/duyong/프로젝트/HelloJenkins/frontend/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js:1871:7)
      at createDescriptor (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:79:42)
      at transformMain (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:1633:33)
      at TransformPluginContext.handler (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:2045:27)
      at file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite-plugin-inspect/dist/shared/vite-plugin-inspect.BzUKaD4x.mjs:403:26
      at hook.handler (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite-plugin-inspect/dist/shared/vite-plugin-inspect.BzUKaD4x.mjs:376:14)
      at EnvironmentPluginContainer.transform (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite/dist/node/chunks/dep-Bm2ujbhY.js:30984:51)
      at async loadAndTransform (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite/dist/node/chunks/dep-Bm2ujbhY.js:26116:26)
6:21:49 PM [vite] Internal server error: At least one <template> or <script> is required in a single file component. /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessStatus.vue
  Plugin: vite:vue
  File: /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessStatus.vue
      at Object.parse$1 [as parse] (/Users/duyong/프로젝트/HelloJenkins/frontend/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js:1871:7)
      at createDescriptor (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:79:42)
      at transformMain (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:1633:33)
      at TransformPluginContext.handler (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:2045:27)
      at file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite-plugin-inspect/dist/shared/vite-plugin-inspect.BzUKaD4x.mjs:403:26
      at hook.handler (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite-plugin-inspect/dist/shared/vite-plugin-inspect.BzUKaD4x.mjs:376:14)
      at EnvironmentPluginContainer.transform (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite/dist/node/chunks/dep-Bm2ujbhY.js:30984:51)
      at async loadAndTransform (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite/dist/node/chunks/dep-Bm2ujbhY.js:26116:26)
6:21:49 PM [vite] Internal server error: At least one <template> or <script> is required in a single file component. /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessTotalStatus.vue
  Plugin: vite:vue
  File: /Users/duyong/프로젝트/HelloJenkins/frontend/src/components/process/components/children/ProcessTotalStatus.vue
      at Object.parse$1 [as parse] (/Users/duyong/프로젝트/HelloJenkins/frontend/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js:1871:7)
      at createDescriptor (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:79:42)
      at transformMain (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:1633:33)
      at TransformPluginContext.handler (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/@vitejs/plugin-vue/dist/index.js:2045:27)
      at file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite-plugin-inspect/dist/shared/vite-plugin-inspect.BzUKaD4x.mjs:403:26
      at hook.handler (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite-plugin-inspect/dist/shared/vite-plugin-inspect.BzUKaD4x.mjs:376:14)
      at EnvironmentPluginContainer.transform (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite/dist/node/chunks/dep-Bm2ujbhY.js:30984:51)
      at async loadAndTransform (file:///Users/duyong/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3/HelloJenkins/frontend/node_modules/vite/dist/node/chunks/dep-Bm2ujbhY.js:26116:26)
6:22:25 PM [vite] (client) hmr update /src/assets/main.css
6:22:53 PM [vite] (client) hmr update /src/assets/main.css (x2)
6:22:53 PM [vite] (client) hmr update /src/assets/main.css (x3)
    `
</script>
<template>
    <h1 class="px-[10px] py-[5px]">Checkout Log</h1>
    <div class="p-[10px]">
        <p class="break-all whitespace-pre-wrap overflow-scroll" v-text="data"></p>
    </div>
</template>