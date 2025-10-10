<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Node } from '../provider/LayoutDataProvider.vue'

interface SaveNodeProps {
  node: Node
}

const props = defineProps<SaveNodeProps>()

const emits = defineEmits<{
  (e: 'click-item', node: Node)
}>()

const isHovered = ref(false)
const statusLabel = '수정됨'

function onClick() {
  emits('click-item', props.node);
}
</script>

<template>
  <li
    class="rounded-md transition-colors duration-200 group flex items-center cursor-pointer select-none relative"
    :class="[
      { 'bg-[#1e1e1e]': !isHovered, 'bg-[#23272e]': isHovered },
      { 'font-bold': props.node.status === 'modified' }
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="onClick"
  >
    <span class="mr-2 text-lg select-none text-yellow-400" style="color:#facc15 !important;">
      ⇅
    </span>
    <span class="flex-1 text-yellow-400 group-hover:text-blue-400 transition-colors duration-200 truncate" style="color:#facc15 !important;">
      {{ props.node.path }}
    </span>
    <span v-if="isHovered" style="color: aliceblue;" class="ml-2 text-xs text-gray-400 pointer-events-none">
      {{ statusLabel }}
    </span>
  </li>
</template>

<style scoped>
li {
  list-style: none;
  font-size: 13px;
  background: #1e1e1e;
  margin-bottom: 0;
  padding: 0;
  transition: background 0.2s;
}
li:hover {
  background: #23272e;
}
.group:hover .group-hover\:text-blue-400 {
  color: #60a5fa !important;
}
</style>
