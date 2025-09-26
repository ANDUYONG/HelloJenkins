
<template>
		<div class="relative h-full flex flex-col bg-[#23272e] rounded-md pr-[60px]">
			<div class="py-[5px] text-gray-200 text-sm font-semibold text-underlined">수정 파일 목록</div>
		<ul class="flex-1 overflow-auto pr-0 p-0">
			<SaveNode
				v-for="node in nodes"
				:key="node.path"
				:node="node"
                @click-item="onClickItem"
			/>
		</ul>
		<div class="px-4 py-[5px] flex justify-end">
			<button
				class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
				@click="onCommitDeploy"
			>
				커밋 후 배포
			</button>
		</div>
	</div>
</template>

<script setup>
import SaveNode from './SaveNode.vue'

const props = defineProps({
	nodes: {
		type: Array,
		required: false
	},
})
const emit = defineEmits(['commit-deploy', 'click-item'])
function onCommitDeploy() {
	emit('commit-deploy')
}

function onClickItem(node) {
    emit('click-item', node);
}
</script>

<style scoped>
ul {
	padding: 0 !important;
}
ul > li {
	margin-bottom: 0 !important;
	padding: 0 !important;
}
</style>
