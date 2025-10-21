<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import type { CurrentType, PipelineStage } from '../../provider/process-data';
import _ from 'lodash'

export interface ProcessLogTabProps {
    value: PipelineStage
    items: PipelineStage[]
    processItems: string[]
    default?: PipelineStage
    isTotalProcess?: boolean
}

const props = defineProps<ProcessLogTabProps>()
const tabItems = ref<PipelineStage[]>([]);
const emits = defineEmits<{
    (e: 'change', tab: PipelineStage, stages: PipelineStage[]),
}>()

const isShow = (name: string) => computed(() => {
    // 1. Total이면서 processItems에 존재하는 이름일 경우
    const total = props.isTotalProcess && props.processItems.includes(name);
    // 2. Total아니면서, NOT_READY가 아닌 경우
    const notTotal = !props.isTotalProcess

    console.log('total', total)
    console.log('notTotal', notTotal)

    return total || notTotal || name === 'Info'
})

// Blue Ocean Inspired Status Colors and Icons - 요청에 따라 스피너/아이콘 정보 반환
const getStatusInfo = (tab: PipelineStage) => {
    const { state, id, name } = tab;
    const checkVal = id === 'Info' ? id : name === 'Post Actions' ? 'success' : state

    switch (checkVal.toLowerCase()) {
        case 'success':
            // 초록색 체크 아이콘 (#4CAF50)
            return { type: 'success', color: '#4CAF50', icon: '✓' }; // 더 아이콘 같은 체크 기호
        case 'running':
            // 짙은 회색 스피너 (#6c757d)
            return { type: 'running', color: '#6c757d', icon: '' };
        case 'failure':
        case 'aborted':
            // 빨간색 X 아이콘 (#F44336)
            return { type: 'failure', color: '#F44336', icon: '✕' }; // 더 아이콘 같은 X 기호
        case 'info':
            // 정보성 상태: Blue Ocean Blue (#2196F3)의 채워진 원 (Info)
            return { type: 'info', color: '#2196F3', icon: '!' }; // type: 'default'를 사용하여 v-else 블록으로 유도
        case 'not_executed':
        case 'notready':
            // 회색 채워진 원으로 미실행 상태 표시
            return { type: 'default', color: '#9e9e9e', icon: '●' };
        default:
            return { type: 'default', color: '#9e9e9e', icon: '●' };
    }
}

onMounted(() => {
    // 복사본에 default 항목 추가
    if (!props.isTotalProcess && props.default) {
        tabItems.value.unshift(_.cloneDeep<PipelineStage>(props.default));
    }
})
</script>
<template>
    <div class="process-log-tab-container">
        <div>
            <h2 class="process-log-tab-title text-lg font-semibold px-4 mb-4">Stages Overview</h2>
        </div>
        <template v-for="tab in props.items" :key="tab.id">
            <div 
                v-if="isShow(tab.name).value" 
                @click="emits('change', tab, props.items)" 
                :class="[
                    'tab-item',
                    { 'tab-selected': props.value ? props.value.id === tab.id : '' },
                ]"
            >
                <div class="tab-status-icon">
                    <template v-if="getStatusInfo(tab).type === 'running'">
                        <div class="spinner-border running" :style="{ 'border-color': getStatusInfo(tab).color }"></div>
                    </template>
                    <template v-else-if="
                        getStatusInfo(tab).type === 'success' 
                        || getStatusInfo(tab).type === 'failure'
                        || getStatusInfo(tab).type === 'info'
                        ">
                        <div class="spinner-border-overlay" :style="{ 'border-color': getStatusInfo(tab).color }">
                            <span class="icon-overlay" :style="{ 'color': getStatusInfo(tab).color }">
                                {{ getStatusInfo(tab).icon }}
                            </span>
                        </div>
                    </template>
                    <template v-else>
                        <span :style="{ color: getStatusInfo(tab).color }">
                            {{ getStatusInfo(tab).icon }}
                        </span>
                    </template>
                </div>
                <div class="tab-name">{{ tab.name }}</div>
            </div>
        </template>
    </div>
</template>

<style scoped>
/* Spinner/Icon Styles */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.tab-status-icon {
    margin-right: 8px;
    font-size: 16px;
    line-height: 1; 
    width: 16px; /* 고정 크기 */
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-shrink: 0;
}

/* Running Spinner Style */
.spinner-border {
    width: 16px;
    height: 16px;
    border: 2px solid;
    border-radius: 50%;
    /* 짙은 회색 스피너: border-right-color를 투명하게 만들어 회전하는 모양을 만듭니다. */
    border-right-color: transparent !important; 
    animation: spin 1s linear infinite;
}

/* Success/Failure Spinner Overlay Style */
.spinner-border-overlay {
    width: 16px;
    height: 16px;
    border: 1px solid; /* 얇은 원 */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* 성공/실패는 회전할 필요가 없으므로 애니메이션 없음 */
}

.icon-overlay {
    position: absolute;
    font-size: 10px; 
    line-height: 1;
    font-weight: bold;
}

/* 기존 스타일 유지 */
.process-log-tab-title {
    padding: 15px;
    padding-top: 0px;
    color: #444;
    font-weight: bold;
    border-bottom: 3px solid #e0e0e0;
}

.process-log-tab-container {
    display: flex;
    flex-direction: column;
    border-right: 8px solid #f7f7f7;
    padding: 10px 0;
    min-width: 150px;
    flex-shrink: 0;
    overflow-y: auto; 
    height: 100%;
}

.tab-item {
    display: flex;
    align-items: center;
    padding: 8px 15px;
    cursor: pointer;
    font-size: 13px;
    color: #444;
    transition: background-color 0.2s, color 0.2s;
    user-select: none;
    position: relative;
    border-left: 3px solid transparent; 
}

/* Hover Style */
.tab-item:hover {
    background-color: #f0f0f0;
}

/* Selected Tab Style (Blue Ocean Primary Color) */
.tab-selected {
    background-color: #e6f7ff;
    color: #007bff;
    font-weight: 600;
    border-left: 3px solid #007bff;
    padding-left: 12px;
}
/* Selected Tab + Hover: Prevent background change when selected and hovered */
.tab-selected:hover {
    background-color: #e6f7ff;
}

.tab-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>