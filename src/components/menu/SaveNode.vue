<template>
  <li
    class="rounded-md transition-colors duration-200 group flex items-center cursor-pointer select-none relative"
    :class="[
      { 'bg-[#1e1e1e]': !isHovered, 'bg-[#23272e]': isHovered },
      { 'font-bold': node.status === 'modified' }
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span class="mr-2 text-lg select-none text-yellow-400" style="color:#facc15 !important;">
      ⇅
    </span>
    <span class="flex-1 text-yellow-400 group-hover:text-blue-400 transition-colors duration-200 truncate" style="color:#facc15 !important;">
      {{ node.path }}
    </span>
    <span v-if="isHovered" class="ml-2 text-xs text-gray-400 pointer-events-none">
      {{ statusLabel }}
    </span>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})
const isHovered = ref(false)
// Only show 'modified' files, so label is always '수정됨'
const statusLabel = '수정됨'
</script>

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
