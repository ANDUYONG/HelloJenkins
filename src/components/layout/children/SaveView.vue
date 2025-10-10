<script setup lang="ts">
import SaveNode from './SaveNode.vue'
import { computed, inject } from 'vue'
import type { API, Node } from '../provider/LayoutDataProvider.vue'

interface SaveViewProps {
	nodes: Node[]
}

const props = defineProps<SaveViewProps>()
const isShow = computed(() => props.nodes && props.nodes.length)
const api = inject<API>('API')
</script>

<template>
	<div class="relative h-full flex flex-col bg-[#23272e] rounded-md">
		<ul class="flex-1 overflow-auto pr-0 p-0">
			<template v-if="isShow">
				<SaveNode
					v-for="node in props.nodes"
					:key="node.path"
					:node="node"
					@click-item="api?.clickItemInSaveView(node)"
				/>
			</template>
		</ul>
	</div>
</template>

<style scoped>
ul {
	padding: 0 !important;
}
ul > li {
	margin-bottom: 0 !important;
	padding: 0 !important;
}
</style>