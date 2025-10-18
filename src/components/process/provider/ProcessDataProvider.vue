<script setup lang="ts">
import { computed, onBeforeMount, provide, reactive, ref } from 'vue';
import type { LeftArea } from '@/components/layout/provider/LayoutDataProvider.vue';
import type { JenkinsPipelineInfo, LogDetail, PipelineStage, ProcessDataProvider, ProcessHeaderTab } from './process-data';
import { INIALIZER } from './process-data';
import _ from 'lodash';
import JenkinsAPI from '@/http/jenkins-api';
import GitHubAPI from '@/http/git-hub-api';

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
                const IsNumber = (value: string | undefined): boolean => {
                    if (value === undefined || value === null || value.trim() === '') {
                        return false;
                    }
                    const num = Number(value);
                    return !isNaN(num) && isFinite(num);
                }

                const { branchName, totalLog, buildNumber } = res
                const idx = data.items.findIndex(x => x.branchName === branchName)
                data.items[idx].buildNumber = buildNumber
                data.items[idx].logs.push(res.logs[0])
                data.items[idx].tree.data.stages = [ 
                    _.cloneDeep(data.items[idx].tree.data.stages[0]),
                    ..._.cloneDeep(reactive(res.tree.data.stages)), 
                ]
                data.items[idx].totalLog = decodeBase64(totalLog)

                if(buildNumber !== -1 && IsNumber(data.currentItem.tree.currentLogTab)) {
                    JenkinsAPI.getOverview(
                        branchName, buildNumber, data.currentItem.tree.currentLogTab
                    ).then(res => {
                        const resData = res.data as string[]
                        const currStageIdx = data.currentItem.logs.findIndex(x => x.id === data.currentItem.tree.currentLogTab)
                        if(currStageIdx !== -1) {
                            data.currentItem.logs[currStageIdx].log.data.text = resData.join('\r\n')
                        }
                    }).catch(e => {
                        alert('오류가 발생했습니다.')
                    })
                }

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
            totalLog: computed(() => {
                const item = data.items.find(x => x.branchName === data.currentItem.tree.currentLogTab)
                return item ? item.totalLog : ''
            }).value,
            currentLogTab: computed(() => data.currentItem.tree.data.stages.find(x => x.id === data.currentItem.tree.currentLogTab)).value,
            currentLogItem: computed(() => data.currentItem.logs.filter(x => x.id === data.currentItem.tree.currentLogItem)).value, 
            currentStage: computed(() => data.currentItem.tree.data.stages.find(x => x.id === data.currentItem.tree.currentLogTab).name).value,
            async onLogTabChange(tab: PipelineStage, items: PipelineStage[]) {
                const IsNumber = (value: string | undefined): boolean => {
                    if (value === undefined || value === null || value.trim() === '') {
                        return false;
                    }
                    const num = Number(value);
                    return !isNaN(num) && isFinite(num);
                }
                console.log('onLogTabChange', tab)
                console.log('currentItem', data.currentItem)
                const { branchName, buildNumber } = data.currentItem
                const exist = items.find(x => x.id === tab.id)
                data.currentItem.tree.currentLogTab = exist.id
                const log = data.currentItem.logs.find(x => x.id === exist.id)
                if(log) data.currentItem.tree.currentLogItem = log.id
                if(buildNumber !== -1 && IsNumber(tab.id)) {
                    await JenkinsAPI.getOverview(branchName, buildNumber, tab.id).then(res => {
                        const resData = res.data as string[]
                        const currStageIdx = data.currentItem.logs.findIndex(x => x.id === data.currentItem.tree.currentLogTab)
                        if(currStageIdx !== -1) {
                            data.currentItem.logs[currStageIdx].log.data.text = resData.join('\r\n')
                        }
                    }).catch(e => {
                        alert('오류가 발생했습니다.')
                    })
                }
            },
        }
    }
});

function decodeBase64(base64String) {
  const binary = atob(base64String);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

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
    <div class="flex flex-col h-screen w-screen">
        <div class="flex h-[350px]">
            <slot name="Header"></slot>
        </div>
        <div class="flex h-[350px]">
            <slot :props="propsSender.status" name="Status"></slot>
        </div>
        <div class="flex flex-1 h-[calc(100vh-700px)] min-h-0 overflow-hidden">
            <div class="grow h-full">
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