<template>
    <li
      class="rounded-md transition-colors duration-200 group"
      :class="[{ 'bg-[#1e1e1e]': !isHovered, 'bg-[#23272e]': isHovered }]"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click.stop="toggle"
    >
      <div class="flex items-center px-3 py-2 cursor-pointer select-none">
        <span
          v-if="hasChildren"
          class="mr-[5px] text-xs text-gray-400 hover:text-blue-400 transition-colors duration-200"
        >
          {{ expanded ? '-' : '+' }}
        </span>
        <span class="text-gray-200 group-hover:text-blue-400 transition-colors duration-200">{{ node.fileName }}</span>
      </div>
      <ul v-if="hasChildren && expanded" class="ml-4 border-l border-gray-700 pl-2">
        <TreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
        />
      </ul>
    </li>
  </template>

<script setup>
import { ref, computed } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const expanded = ref(false)
const hasChildren = computed(() => Array.isArray(props.node.children) && props.node.children.length > 0)
const isHovered = ref(false)
function toggle() {
  expanded.value = !expanded.value
}
</script>

<style scoped>
  ul {
      padding-left: 15px;
  }
  li {
    padding: 0px;
    list-style:  none;
    font-size: 13px;
    background-color: grey;
  }
  li {
    /* 기본 배경색: Monaco Editor와 비슷한 다크톤 */
    background: #1e1e1e;
    margin-bottom: 4px;
  }
  li:hover {
    /* hover 시 더 밝은 다크톤 */
    background: #23272e;
  }
  .group:hover .group-hover\:text-blue-400 {
    color: #60a5fa !important;
  }
</style>