<script setup lang="ts">
    import { computed, inject, ref } from 'vue'
    import SaveView from './children/SaveView.vue';
    import TreeNode from './children/TreeNode.vue';
    import type { LeftArea, MainArea, API } from './provider/LayoutDataProvider.vue'

    const data = inject<LeftArea>('leftArea')
    const main = inject<MainArea>('mainArea')
    const isShowTree = computed(() => data && data.tree && data.tree.length > 0);
    const isShowSavedView = computed(() => main && main.savedNodes && main.savedNodes.length > 0)
    const api = inject<API>('API')
</script>
<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto">
        <template v-if="isShowTree">
            <TreeNode
                v-for="node in data.tree"
                :node="node"
            />
        </template>
    </div>
    <div class="w-[300px] h-[200px] mx-auto mt-2">
        <div class="flex justify-between">
            <div style="color: aliceblue;" class="py-[5px] text-sm font-semibold text-underlined">
                수정 파일 목록
            </div>
            <div
                class="px-4 py-[5px]"
            >
                <button
                    class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                    @click="() => api.save()"
                >
                    변경사항 저장
                </button>
                <button
                    class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                    @click="() => api.commitAndDeploy()"
                >
                    커밋 후 배포
                </button>
            </div>
        </div>
		<input 
			v-model="data.msg" 
			type="text" 
			placeholder="커밋 메세지를 입력하세요." 
			class="w-full mb-2 p-2 rounded bg-[#2c2f36] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
			style="color: white;"
		/>
        
        <SaveView 
            v-if="isShowSavedView"
            :nodes="main.savedNodes" 
        />
    </div>
  </div>
</template>