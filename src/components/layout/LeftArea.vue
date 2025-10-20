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
  <!-- H2 태그에 입체 효과를 위한 floating-header 클래스 및 너비/마진 추가 -->
  <h2 class="w-[350px] p-3 mb-4 text-xl rounded-lg floating-header">Hello Jenkins !</h2>
  <!-- 루트 div에 W:[350px]와 입체 효과 스타일을 적용하여 전체 패널을 띄웁니다. -->
  <!-- p-4로 내부 여백을 주고, left-area-floating 클래스로 그림자 효과를 적용합니다. -->
    <div class="flex flex-col w-[350px] p-4 rounded-xl left-area-floating">
      
      <!-- 파일 목록/트리 영역 (H:500px) -->
    <div class="h-[500px]">
        <div class="flex mb-2">
            <Select
                v-model="data.selectedItem"
                :items="data.select"
                @change="api.selectChangeEvent"
            />
            <div v-if="data.isShowSelectSpinner" class="spinner"></div>
        </div>
        <div class="h-full overflow-auto mt-2">
            <template v-if="isShowTree">
                <TreeNode
                    v-for="node in data.tree"
                    :node="node"
                />
            </template>
        </div>
    </div>
    
    <!-- 영역 분리선 추가 (파일 트리와 수정 파일 목록 사이) -->
    <div class="h-[1px] w-full bg-[#4a5568] my-4 opacity-50"></div>

    <!-- 수정 파일 목록 (내부 카드) - inner-card 스타일 재정의 -->
    <div class="flex-grow p-[5px] rounded-xl inner-card">
        <template v-if="data.selectedItem.name">
            <div class="flex justify-between items-center mb-2">
                <div style="color: aliceblue;" class="py-[5px] text-sm font-semibold text-underlined">
                    수정 파일 목록
                </div>
                <div
                    class="flex space-x-2"
                >
                    <button
                        class="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors duration-200 cursor-pointer text-xs font-medium"
                        @click="() => api.save()"
                    >
                        변경사항 저장
                    </button>
                    <button
                        class="px-3 py-1 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors duration-200 cursor-pointer text-xs font-medium"
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
                class="w-full mb-2 p-2 rounded bg-[#353941] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                style="color: aliceblue;"
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
/* 기존 spinner 스타일 */
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

/* 전체 왼쪽 패널 컨테이너 스타일: 오른쪽 구분선 효과 추가 */
.left-area-floating {
  /* 카드 자체의 배경색을 부모(#23272e)보다 살짝 밝게 설정하여 대비를 줍니다. */
  background-color: #2c2f36; 
  
  /* 요즘 스타일에 맞게 그림자 재정의: 미묘한 리프트 효과와 오른쪽 구분선 */
  box-shadow: 
    /* 1. 은은한 리프트 효과 */
    0 4px 12px rgba(0, 0, 0, 0.5), 
    /* 2. 오른쪽 Content와 구분되는 밝은 경계선/글로우 */
    2px 0 10px rgba(66, 153, 225, 0.4); 
    
  transition: box-shadow 0.3s ease;
}

/* 호버 효과 (전체 패널) */
.left-area-floating:hover {
  /* 호버 시 오른쪽 구분선/글로우를 조금 더 강조 */
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.7),
    3px 0 15px rgba(66, 153, 225, 0.6);
}

/* inner-card 스타일 (내부의 '수정 파일 목록' 카드): border 제거, 배경색 유지 */
.inner-card {
  /* 배경색을 main과 동일하게 유지 */
  background-color: #2c2f36; 
}

/* 'Hello Jenkins !' 제목에 적용되는 플로팅 스타일 */
.floating-header {
  background-color: #2c2f36; /* 패널과 동일한 배경색 */
  text-align: center;
  /* box-shadow를 적용하여 떠 있는 느낌 부여 */
  box-shadow: 
    0 5px 15px rgba(0, 0, 0, 0.7), /* 깊이감을 주는 그림자 */
    0 0 10px rgba(66, 153, 225, 0.5); /* 푸른 발광 효과 */
  
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* 제목 호버 효과 */
.floating-header:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 1),
    0 0 15px rgba(66, 153, 225, 0.8);
}
</style>