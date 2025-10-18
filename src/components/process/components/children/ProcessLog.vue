<script setup lang="ts">
import { onMounted } from 'vue';
import { LogItem } from '../../provider/process-data';

export interface ProcessLogTabProps {
  item: LogItem[]
  title: string
}

const props = defineProps<ProcessLogTabProps>()
</script>
<template>
    <h1 class="px-[10px] py-[5px]">{{ props.title }}</h1>
    <div class="p-[10px]">
      <template v-for="{ log } in props.item">
        <span class="break-all whitespace-pre-wrap overflow-scroll">
          {{ log.data.text }}
        </span>
      </template>
    </div>
</template>