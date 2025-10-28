<script setup lang="ts">
export interface ProcessStatusLayoutProps {
    isTotal: boolean;
}

const { isTotal } = defineProps<ProcessStatusLayoutProps>()
</script>
<template>
    <div class="flex flex-col p-[10px] size-full process-layout-container">
        <div class="flex flex-col">
            <div class="flex grow h-[40px] internal-area-bottom-border">
                <slot name="BranchTab"></slot>
            </div>
        </div>
        <div class="flex content-area">
            <template v-if="isTotal">
                <div class="basis-1/3 internal-area-right-border">
                    <slot name="Header"></slot>
                </div>
            </template>
            <div :class="`${isTotal ? 'basis-2/3' : 'w-full'} px-[20px] py-[8px]`">
                <slot name="Content"></slot>
            </div>
        </div>
    </div>
</template>
<style scoped>
.process-layout-container {
    width: 100%;
    font-family: Arial, sans-serif;
    color: #333;
    height: 100%;
}
.content-area {
    padding-top: 5px;
    flex-grow: 1; 
    min-height: 0;
}
/* 내부 영역 구분선 (요청된 border) */
.internal-area-bottom-border {
    flex-shrink: 0;
}
.internal-area-right-border {
    padding: 20px solid #e0e0e0;
    border-right: 1px solid #e0e0e0; /* Header와 Content 영역 구분선 */
}
</style>