<script setup lang="ts">
import { ProcessHeaderTab } from '../../provider/process-data';

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
    <div class="flex flex-1">
        <template v-for="tab in props.items">
            <div v-if="props.processItems.includes(tab.branchName) || tab.branchName === 'Total'" @click="emits('change', tab)" class="flex justify-center items-center cursor-pointer basis-1/6">
                {{ tab.branchName }}
            </div>
        </template>
    </div>
</template>