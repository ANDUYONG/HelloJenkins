<script setup lang="ts">
import SaveNode from './SaveNode.vue'
import { computed, inject } from 'vue'
import type { API, LeftArea, Node, Process } from '../provider/LayoutDataProvider.vue'

interface SaveViewProps {
	props: Process[]
}

const props = defineProps<SaveViewProps>()
const data = inject<LeftArea>('leftArea')
const api = inject<API>('API')
</script>

<template>
	<div>
		<template
			v-for="process in props.props"
		>
			<template v-if="process.name === data.selectedSavedTab">
				<div class="relative h-[150px] flex flex-col bg-[#23272e] rounded-m m-[5px] pb-[5px]">
					<ul class="flex-1 overflow-auto pr-0">
						<template v-if="process.nodes.length">
							<SaveNode
								v-for="node in process.nodes"
								:key="node.path"
								:node="node"
								@click-item="api?.clickItemInSaveView(node)"
							/>
						</template>
						<template v-else>
							파일 변경사항을 저장하면 목록에 추가됩니다.
						</template>
					</ul>
				</div>
			</template>
		</template>
	</div>
</template>

<style scoped>
ul {
	padding: 0 !important;
	background-color: #303643;
	border: 1px solid #3b414e;
}
ul > li {
	margin-bottom: 0 !important;
	padding: 0 !important;
}
</style>