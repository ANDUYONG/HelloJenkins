<script setup lang="ts">
import { computed, onBeforeMount, provide, reactive, ref } from 'vue';
import type { LeftArea } from '@/components/layout/provider/LayoutDataProvider.vue';
import type { JenkinsPipelineInfo, LogDetail, PipelineStage, ProcessDataProvider, ProcessHeaderTab } from './process-data';
import { INIALIZER } from './process-data';
import _ from 'lodash';
import JenkinsAPI from '@/http/jenkins-api';

export interface ProcessDataProviderProps {
    props: LeftArea
}

const { pipelineInfoItems, headerTabs } = INIALIZER
const props = defineProps<ProcessDataProviderProps>()
const data = reactive<ProcessDataProvider>({
    currentItem: null,
    items: [],
    isTotalProcess: false,
})

// ✅ computed로 propsSender를 래핑
const propsSender = computed(() => {
    // currentItem이 null이 아닐 때만 객체를 반환
    if (!data.currentItem) {
        return { status: {}, log: {} }; // 안전한 빈 객체 반환
    }
    return {
        overview: {
            processItems: props.props.processItems,
            onResponse(res: JenkinsPipelineInfo) {
                const { branchName } = res
                const idx = data.items.findIndex(x => x.branchName === branchName)
                data.items[idx].logs.push(res.logs[0])
                data.items[idx].tree.data.stages = [ 
                    _.cloneDeep(data.items[idx].tree.data.stages[0]),
                    ..._.cloneDeep(reactive(res.tree.data.stages)), 
                ]

                const { buildNumber } = data.currentItem

                JenkinsAPI.getOverview(
                    branchName, buildNumber, data.currentItem.tree.currentLogTab
                ).then(res => {
                    const resData = res.data as LogDetail
                    const currStageIdx = data.currentItem.logs.findIndex(x => x.id === data.currentItem.tree.currentLogTab)
                    if(currStageIdx !== -1) {
                        data.currentItem.logs[currStageIdx].log = _.cloneDeep(resData)
                    }
                }).catch(e => {
                    alert('오류가 발생했습니다.')
                })

                console.log('data.items[idx].tree.data.stages', data.items[idx].tree.data.stages)
            }
        },
        status: {
            processItems: props.props.processItems,
            tabs: headerTabs,
            currentTab: computed(() => headerTabs.find(x => data.currentItem.branchName === x.branchName)).value,
            tree: data.currentItem.tree, 
            isTotalProcess: data.isTotalProcess,
            onHeaderTabChange(tab: ProcessHeaderTab) {
                console.log('onHeaderTabChange', tab)
                const exist = data.items.find(x => x.branchName === tab.branchName)
                if(exist) {
                    data.currentItem = exist
                    data.currentItem.tree.currentLogTab = exist.tree.data.stages[0].id
                    data.currentItem.tree.currentLogItem = exist.logs[0].id
                    data.isTotalProcess = exist.branchName === 'Total'
                }
            },
        },
        log: {
            processItems: props.props.processItems,
            tree: data.currentItem.tree, 
            isTotalProcess: data.isTotalProcess,
            currentLogTab: computed(() => data.currentItem.tree.data.stages.find(x => x.id === data.currentItem.tree.currentLogTab)).value,
            currentLogItem: computed(() => data.currentItem.logs.filter(x => x.id === data.currentItem.tree.currentLogItem)).value, 
            currentStage: computed(() => data.currentItem.tree.data.stages.find(x => x.id === data.currentItem.tree.currentLogTab).name).value,
            async onLogTabChange(tab: PipelineStage, items: PipelineStage[]) {
                console.log('onLogTabChange', tab)
                const { branchName, buildNumber } = data.currentItem
                await JenkinsAPI.getOverview(branchName, buildNumber, tab.id).then(res => {
                    const exist = items.find(x => x.id === tab.id)
                    if(exist) {
                        data.currentItem.tree.currentLogTab = exist.id
                        const log = data.currentItem.logs.find(x => x.id === exist.id)
                        if(log) data.currentItem.tree.currentLogItem = log.id

                        const resData = res.data as LogDetail
                        const currStageIdx = data.currentItem.logs.findIndex(x => x.id === data.currentItem.tree.currentLogTab)
                        if(currStageIdx !== -1) {
                            data.currentItem.logs[currStageIdx].log = _.cloneDeep(resData)
                        }
                    }
                }).catch(e => {
                    alert('오류가 발생했습니다.')
                })
            },
        }
    }
});

function onInit() {
    const items = pipelineInfoItems.map<JenkinsPipelineInfo>(x => {
        return {
            ...x,
            tree: {
                ...x.tree,
                data: {
                    ...x.tree.data,
                    stages: [
                        ...x.tree.data.stages.map(y => {
                            return {
                                ...y,
                                state: props.props.processItems.includes(y.name) || y.name === 'Total' ? 'NOT_EXECUTED' : 'NOT_READY'
                            }
                        })
                    ]
                }
            }
        }
    })

    data.items = _.cloneDeep<JenkinsPipelineInfo[]>(items)
    data.currentItem = _.cloneDeep<JenkinsPipelineInfo>(items[0])
    data.currentItem.tree.currentLogTab = data.currentItem.tree.data.stages[0].id
    data.currentItem.tree.currentLogItem = data.currentItem.logs[0].id
    data.isTotalProcess = true

    console.log('props', props.props.processItems)
}

onBeforeMount(onInit)

provide('process', data)
</script>
<template>
    <div class="flex flex-col min-h-screen w-screen">
        <div class="flex h-[350px]">
            <slot name="Header"></slot>
        </div>
        <div class="flex h-[350px]">
            <slot :props="propsSender.status" name="Status"></slot>
        </div>
        <div class="flex flex-4 min-h-0">
            <div class="grow">
                <slot :props="propsSender.log" name="Log"></slot>
            </div>
        </div>
        <div :data="props.props" class="hidden">
            <slot :props="propsSender.overview" name="Socket"></slot>
        </div>
    </div>
</template>

<style setup>
    div {
        background: aliceblue;
        border: 1px solid black;
        color: black;
    }
</style>