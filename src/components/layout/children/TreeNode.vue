<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import TreeNode from './TreeNode.vue'
import type { API, LeftAreaNode, MainArea } from '../provider/LayoutDataProvider.vue'


export interface TreeNodeProps {
  node: LeftAreaNode | null
}

const props = defineProps<TreeNodeProps>()
const main = inject<MainArea>('mainArea')
const key = computed(() => props.node?.sha || props.node?.fileName || props.node?.path || '')
const expanded = ref(false)
const hasChildren = computed(() => Array.isArray(props.node.children) && props.node.children.length > 0)
const isHovered = ref(false)

const api = inject<API>('API')

function onClick(node: LeftAreaNode) {
    if(node.type === 'tree') {
      expanded.value = !expanded.value
    } else {
      if(!main || !main.currentNode || main.currentNode.sha !== props.node.sha) {  
        api.detail(props.node.path)
      }
    }
}
</script>

<template>
    <li
      v-if="props"
      :key="key"
      class="rounded-md transition-colors duration-200 group"
      :class="[{ 'bg-[#1e1e1e]': !isHovered, 'bg-[#23272e]': isHovered }]"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div
        class="flex items-center px-3 py-2 cursor-pointer select-none"
        @click.stop="onClick(props.node)"
        >
        <span
          v-if="hasChildren"
          style="color: aliceblue;"
          class="mr-[5px] text-xs text-gray-400 hover:text-blue-400 transition-colors duration-200"
        >
          {{ expanded ? '-' : '+' }}
        </span>
        <span style="color: aliceblue;" class="text-gray-200 group-hover:text-blue-400 transition-colors duration-200">{{ node.fileName }}</span>
      </div>
      <ul v-if="hasChildren && expanded" class="ml-4 border-l border-gray-700 pl-2">
        <TreeNode
          v-for="child in node.children"
          :node="child"
          @toggle="onClick"
        />
      </ul>
    </li>
</template>

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