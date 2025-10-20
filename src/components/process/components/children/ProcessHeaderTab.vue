<script setup lang="ts">
import type { ProcessHeaderTab } from '../../provider/process-data';

export interface ProcessLogTabProps {
    value: ProcessHeaderTab
    items: ProcessHeaderTab[]
    processItems: string[]
}

const emits = defineEmits<{
    (e: 'change', tab: ProcessHeaderTab),
}>()
const props = defineProps<ProcessLogTabProps>()
</script>
<template>
    <div class="flex flex-1 process-header-tab-container">
        <template v-for="tab in props.items" :key="tab.branchName">
            <div 
                v-if="props.processItems.includes(tab.branchName) || tab.branchName === 'Total'" 
                @click="emits('change', tab)"
                :class="[
                    'tab-item',
                    { 'tab-selected': props.value ? props.value.branchName === tab.branchName : false },
                ]"
            >
                <div class="tab-name">{{ tab.branchName }}</div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.process-header-tab-container {
    border-bottom: 1px solid #e0e0e0; /* 탭 구분선 */
}

.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-basis: 16.666667%; /* basis-1/6 */
    padding: 8px 10px;
    font-size: 16px;
    color: #444; /* 기본 텍스트 색상 */
    transition: background-color 0.2s, border-bottom 0.2s;
    position: relative;
    user-select: none;
    font-weight: bold;
}

/* Hover Style */
.tab-item:hover {
    background-color: #f0f0f0; /* 밝은 회색으로 호버 */
}

/* Selected Tab Style (Blue Ocean Primary Color) */
.tab-selected {
    color: #007bff; /* 텍스트 색상을 파란색으로 변경 */
    border-bottom: 3px solid #007bff; /* 파란색 밑줄로 선택 표시 */
    font-weight: 600;
}

.tab-name {
    /* 탭 이름 스타일 */
}
</style>