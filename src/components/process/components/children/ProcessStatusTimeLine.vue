<script setup lang="ts">
import { computed } from 'vue';
import type { PipelineStage } from '../../provider/process-data';

export interface ProcessStatusTimeLineProps {
    items: PipelineStage[]
    isTotalProcess?: boolean
    processItems?: string[]
    totalSecends
}

const props = defineProps<ProcessStatusTimeLineProps>()

/**
 * 상태에 따른 색상 정보 (Blue Ocean 스타일)를 반환합니다.
 */
const getStatusStyles = (state: string, stage?: PipelineStage) => {
    const status = stage && stage.name === 'Post Actions' ? 'success' : state;
    console.log('stage', stage);
    console.log('status', status);

    switch (status.toLowerCase()) {
        case 'success':
            return { color: '#4CAF50', icon: '✓', styleClass: 'status-success' }; // Green
        case 'running':
            return { color: '#2196F3', icon: '', styleClass: 'status-running' }; // Blue (Running/Loading)
        case 'failure':
        case 'aborted':
            return { color: '#F44336', icon: '✕', styleClass: 'status-failure' }; // Red
        case 'not_executed':
        case 'notready':
        case 'info':
        default:
            return { color: '#9E9E9E', icon: '●', styleClass: 'status-default' }; // Gray (Not Ready/Default)
    }
}

/**
 * Stage 소요 시간을 사람이 읽기 쉬운 형식으로 변환합니다.
 */
const formatDuration = (millis: number | undefined): string => {
    if (millis === undefined || millis < 0) return '';
    
    const seconds = Math.floor(millis / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = [];
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    if (seconds < 60 && seconds > 0) result.push(`${remainingSeconds}s`);
    if (result.length === 0 && seconds === 0) return '0s';
    
    return result.join(' ');
}

const items = computed(() => {
    const processItems = [
        ...props.processItems,
        'dev',
        'main',
    ];
    const _processItems = props.items.filter(y => processItems.includes(y.name))
    return props.isTotalProcess ? _processItems : props.items.filter(x => x.id !== 'Info');
});

const totalDuration = computed(() => {
    return formatDuration(items.value.reduce((acc, x) => acc + (x.totalDurationMillis || 0), 0));
});

const pipelineStatus = computed(() => {
    const lastStage = props.items.slice(-1)[0];
    return lastStage ? getStatusStyles(lastStage.state) : getStatusStyles('notready');
});
</script>
<template>
    <div class="pipeline-timeline-container">
        <div class="timeline-header">
            <h3 class="header-title">{{ props.isTotalProcess ? 'Total Branches Flow' : 'Pipeline Stages Flow' }}</h3>
            <div class="header-summary">
                <span class="summary-status-label" :style="{ 'color': pipelineStatus.color }">
                    {{ pipelineStatus.styleClass.replace('status-', '').toUpperCase() }}
                </span>
                <span class="summary-duration">
                    Total Duration: {{ totalDuration }}
                </span>
            </div>
        </div>

        <div class="timeline-body-horizontal">
            <template v-for="(stage, index) in items" :key="stage.id">
                <div class="timeline-stage-item-horizontal">
                    
                    <div 
                        v-if="index > 0" 
                        class="horizontal-line left-segment" 
                        :style="{ 'background-color': getStatusStyles(props.items[index-1].state).color }">
                    </div>
                    
                    <div 
                        v-if="index < items.length - 1" 
                        class="horizontal-line right-segment" 
                        :style="{ 'background-color': getStatusStyles(stage.state).color }">
                    </div>

                    <div class="stage-icon-wrapper-horizontal">
                        <div class="stage-icon" :class="getStatusStyles(stage.state, stage).styleClass">
                            <template v-if="getStatusStyles(stage.state, stage).styleClass === 'status-running'">
                                <div class="spinner-border"></div>
                            </template>
                            <template v-else>
                                <span class="status-symbol" :style="{ 'color': getStatusStyles(stage.state, stage).color }">
                                    {{ getStatusStyles(stage.state, stage).icon }}
                                </span>
                            </template>
                        </div>
                    </div>
                    
                    <div class="stage-details-horizontal flex flex-col">
                        <div class="stage-name basis-1/3" :style="{ 'color': getStatusStyles(stage.state, stage).color }">
                            {{ stage.name }}
                        </div>
                        <div v-if="props.isTotalProcess" class="stage-title basis-1/3" :style="{ 'color': getStatusStyles(stage.state, stage).color }">
                            {{ stage.title ? stage.title : 'Not Started' }}
                        </div>
                        <div class="stage-duration basis-1/3">
                            {{ formatDuration(stage.totalDurationMillis) || 'In Progress...' }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
/* ================================== */
/* 1. 기본 레이아웃 스타일: 부모 영역 채우기 */
/* ================================== */
.pipeline-timeline-container {
    height: 100%; 
    width: 100%; 
    padding: 15px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}

.timeline-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0;
}
/* (나머지 헤더 스타일 생략) */

/* ================================== */
/* 2. 가로형 타임라인 본문 스타일: 중앙 정렬 및 가로 확장 */
/* ================================== */
.timeline-body-horizontal {
    display: flex;
    align-items: center; 
    justify-content: center; 
    flex-grow: 1; 
    overflow-x: auto; 
    padding-bottom: 10px;
    padding-top: 10px; /* 아이콘 중앙 정렬을 위한 여유 공간 확보 */
}

.timeline-stage-item-horizontal {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 5px; 
    flex-shrink: 1; /* 축소 가능 */
    flex-grow: 1; /* 균등하게 확장 */
    min-width: 80px; /* 최소 너비 */
    text-align: center;
}

/* ================================== */
/* 3. 라인 스타일 (수평 연결) */
/* ================================== */

/* 아이콘 중앙 위치 (height: 20px) */
/* 공통 라인 스타일 */
.horizontal-line {
    position: absolute;
    height: 2px;
    top: 10px; /* 아이콘의 수직 중앙에 라인이 지나가도록 설정 */
    z-index: 1;
}

/* 이전 스테이지와의 연결선 (좌측) */
.left-segment {
    width: 50%; /* 스테이지 아이템 너비의 절반 */
    left: 0;
}
/* 다음 스테이지와의 연결선 (우측) */
.right-segment {
    width: 50%; /* 스테이지 아이템 너비의 절반 */
    right: 0;
}

/* 첫 번째 아이템: 좌측 라인 제거 */
.timeline-stage-item-horizontal:first-child .left-segment {
    display: none;
}
/* 마지막 아이템: 우측 라인 제거 */
.timeline-stage-item-horizontal:last-child .right-segment {
    display: none;
}

/* ================================== */
/* 4. 아이콘 스타일 (Line 중앙 통과와 관련) */
/* ================================== */
.stage-icon-wrapper-horizontal {
    position: relative;
    width: 20px;
    height: 20px;
    margin-bottom: 5px;
    flex-shrink: 0;
    z-index: 2; /* 라인보다 위로 */
}

.stage-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff; 
    border: 1px solid;
}
/* (나머지 아이콘 및 스피너 스타일 유지) */

/* ================================== */
/* 5. Stage 상세 정보 스타일 */
/* ================================== */
.stage-details-horizontal {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    word-break: break-word; 
}

.stage-name {
    font-size: 1.0em; 
    font-weight: 600;
    color: #444;
}

.stage-title {
    font-size: 0.9em; 
    font-weight: 500;
    color: #444;
}

.stage-duration {
    font-size: 0.8em; 
    color: #999;
    margin-top: 2px;
}
</style>