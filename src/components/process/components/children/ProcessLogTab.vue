<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { PipelineStage } from '../../provider/process-data';
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

onMounted(() => {
    // 복사본에 default 항목 추가
    if (!props.isTotalProcess && props.default) {
        tabItems.value.unshift(_.cloneDeep<PipelineStage>(props.default));
    }
})
</script>
<template>
    <div class="flex flex-col">
        <template v-for="tab in props.items">
            <div v-if="isShow(tab.name).value" @click="emits('change', tab, props.items)" class="flex justify-center py-[5px] cursor-pointer">
                {{ tab.name }}
            </div>
        </template>
    </div>
</template>