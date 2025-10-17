<script setup lang="ts">
import { onMounted } from 'vue';
import { LogItem } from '../../provider/process-data';

export interface ProcessLogTabProps {
  item: LogItem
  title: string
}

const props = defineProps<ProcessLogTabProps>()
</script>
<template>
    <h1 class="px-[10px] py-[5px]">{{ props.title }}</h1>
    <div class="p-[10px]">
        <p class="break-all whitespace-pre-wrap overflow-scroll" v-text="props.item.log.data.text"></p>
    </div>
</template>