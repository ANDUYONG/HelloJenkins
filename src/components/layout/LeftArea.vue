<script setup lang="ts">
    import { computed, inject, ref, watch } from 'vue'
    import SaveView from './children/SaveView.vue';
    import TreeNode from './children/TreeNode.vue';
    import Select from '../Select.vue';
    import type { LeftArea, MainArea, API } from './provider/LayoutDataProvider.vue'
    import SaveTab from './children/SaveTab.vue';

    const data = inject<LeftArea>('leftArea')
    const main = inject<MainArea>('mainArea')
    const isShowTree = computed(() => data && data.tree && data.tree.length > 0);
    const isShowSavedView = computed(() => main && main.savedNodes && main.savedNodes.length > 0)
    const api = inject<API>('API')

    watch(() => data.selectedItem, newValue => {
        api.getTreeList(newValue.name) 
    })
</script>
<template>
  <div class="flex flex-col h-full">
    <div class="h-[500px]">
        <div class="flex">
            <Select
                v-model="data.selectedItem"
                :items="data.select"
                @change="api.selectChangeEvent"
            />
            <div v-if="data.isShowSelectSpinner" class="spinner"></div>
        </div>
        <div class="h-full overflow-auto">
            <template v-if="isShowTree">
                <TreeNode
                    v-for="node in data.tree"
                    :node="node"
                />
            </template>
        </div>
    </div>
    <div class="w-[350px] h-[255px] mx-auto mt-2 border border-[#303643] outline-[1px] p-[5px] rounded-xl">
        <template v-if="data.selectedItem.name">
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
                        커밋, 빌드 및 테스트
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
            <SaveTab/>
            <SaveView
                :props="data.processList" 
            />
        </template>
        <template v-else>
            수정할 브랜치를 선택하세요.
        </template>
    </div>
  </div>
</template>
<style setup>
.spinner {
  border: 4px solid rgba(0,0,0,0.1);
  border-left-color: #4f46e5; /* 원하는 색상 */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0px;
  margin-top: 3px;
  margin-left: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
