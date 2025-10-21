<script setup lang="ts">
import { computed } from 'vue';
// ProcessDataProvider.vue에서 이 타입이 정의되어 있다고 가정하고 CurrentType을 사용합니다.
// process-data.ts 파일에서 해당 타입 정의 스니펫을 참고했습니다.
export interface CurrentType {
    branch: string;
    status: 'ready' | 'running' | 'fail' | 'success' | string;
}

export interface ProcessTotalStatusProps {
    value?: CurrentType // 현재 선택된 아이템 (TotalStatus에서는 사용하지 않을 수 있음)
    items: CurrentType[] // 전체 브랜치 목록과 상태를 담고 있는 배열
}

const props = defineProps<ProcessTotalStatusProps>()

/**
 * 상태에 따른 배경색 클래스를 반환합니다.
 * Tailwind CSS 대신 일반 CSS 변수나 색상 코드를 사용하여 구현합니다.
 */
const getStatusBackgroundColor = (status: string): string => {
    console.log('--- total status ---');
    console.log(status);
    console.log('--------------------');
    switch (status.toLowerCase()) {
        case 'success':
            return '#4CAF50'; // 초록색
        case 'running':
            return '#FFEB3B'; // 노란색 (Running)
        case 'fail':
        case 'failure':
            return '#F44336'; // 빨간색
        case 'ready':
        case 'not_executed':
        case 'notready':
            return '#E0E0E0'; // 회색 (Ready/Not Executed)
        default:
            return '#BDBDBD'; // 기본 회색
    }
}

/**
 * 상태에 따른 텍스트 색상 및 깜빡임 클래스를 반환합니다.
 */
const getItemClass = (status: string) => {
    const isRunning = status.toLowerCase() === 'running';
    
    // running (노란색)일 때만 텍스트를 검정색으로 설정
    const textColor = isRunning ? 'color: #000000;' : 'color: #FFFFFF;';
    
    // running일 때 깜빡임 애니메이션 클래스 추가
    const flashClass = isRunning ? 'flash-running' : '';

    return { textColor, flashClass };
}

/**
 * 상태가 running일 때 텍스트 색상을 어둡게 조정합니다.
 */
const getStatusTextColor = (status: string): string => {
    // running (노란색)일 때 텍스트가 잘 보이도록 검정색을 사용
    if (status.toLowerCase() === 'running') {
        return '#000000'; 
    }
    // 나머지는 흰색 텍스트
    return '#FFFFFF';
}

</script>
<template>
    <div class="process-total-status-container">
        <template v-for="(item, index) in props.items" :key="item.branch">
            <div 
                class="branch-status-item"
                :class="getItemClass(item.status).flashClass"
                :style="{ 
                    'background-color': getStatusBackgroundColor(item.status),
                    'color': getItemClass(item.status).textColor,
                }"
            >
                <span class="branch-name">{{ item.branch }}</span>
                <span class="branch-status">{{ item.status.toUpperCase() }}</span>
            </div>
        </template>
    </div>
</template>
<style scoped>
/* 깜빡이는 애니메이션 정의 */
@keyframes flash-animation {
    0%, 100% { 
        /* 1단계: Running 색상 (노란색), 그림자 강조 */
        background-color: var(--running-color, #FFEB3B); 
        box-shadow: 0 0 10px rgba(255, 235, 59, 0.7);
    }
    50% { 
        /* 2단계: Ready 색상 (회색), 그림자 제거 */
        background-color: var(--ready-color, #E0E0E0);
        box-shadow: none; 
    }
}

.process-total-status-container {
    display: flex;
    flex-direction: column; 
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    gap: 8px; 
}

.branch-status-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1; 
    padding: 10px;
    border-radius: 4px;
    font-weight: bold;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, opacity 0.3s; 
    min-height: 40px; 
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Running 상태일 때 애니메이션 적용 */
.branch-status-item.flash-running {
    animation: flash-animation 2.5s ease-in-out infinite;
}

.branch-name {
    font-size: 1.1em;
    margin-bottom: 2px;
}

.branch-status {
    font-size: 0.85em;
    opacity: 0.8;
}
</style>