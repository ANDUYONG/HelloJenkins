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
    currentType: {
        branch: 'feature',
        status: 'ready',
    },
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
            currentType: data.currentType,
            currentTypeItems: INIALIZER.currentTypes,
            processItems: props.props.processItems,
            tabs: headerTabs,
            currentTab: computed(() => headerTabs.find(x => data.currentItem.branchName === x.branchName)).value,
            tree: data.currentItem.tree, 
            stages: data.currentItem.tree.data.stages,
            isTotalProcess: data.isTotalProcess,
            onHeaderTabChange(tab: ProcessHeaderTab) {
                console.log('onHeaderTabChange', tab)
                const exist = data.items.find(x => x.branchName === tab.branchName)
                if(exist) {
                    data.isTotalProcess = exist.branchName === 'Total'
                    data.currentItem = exist

                    const currentLogTab = exist.tree.data.stages.find(x => x.id === tab.branchName)
                    data.currentItem.tree.currentLogTab = currentLogTab ? currentLogTab.id : data.currentItem.tree.currentLogTab
                    data.currentItem.tree.currentLogItem = data.currentItem.tree.currentLogTab                }
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
            currentStage: computed(() => {
                const stage = data.currentItem.tree.data.stages.find(x => x.id === data.currentItem.tree.currentLogTab)
                return stage ? stage.name : ''
            }).value,
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
    data.items = _.cloneDeep<JenkinsPipelineInfo[]>(pipelineInfoItems)
    data.currentItem = _.cloneDeep<JenkinsPipelineInfo>(data.items[0])

    const defaultId = props.props.processItems[0]
    data.currentItem.tree.currentLogTab = defaultId
    data.currentItem.tree.currentLogItem = defaultId
    data.isTotalProcess = true

    console.log('props', props.props.processItems)
}

onBeforeMount(onInit)

provide('process', data)
</script>
<template>
    <div class="jenkins-blue-ocean-light-container flex flex-col h-screen w-screen gap-[15px]">
        <div class="flex h-[350px]">
            <div class="jenkins-card">
                <slot name="Header"></slot>
            </div>
        </div>
        <div class="flex h-[350px]">
            <div class="jenkins-card">
                <slot :props="propsSender.status" name="Status"></slot>
            </div>
        </div>
        <div class="flex flex-1 h-[400px] overflow-hidden">
            <div class="jenkins-card">
                <div>
                    <slot :props="propsSender.log" name="Log"></slot>
                </div>
            </div>
        </div>
        <div :data="props.props" class="hidden">
            <slot :props="propsSender.overview" name="Socket"></slot>
        </div>
    </div>
</template>

<style setup>
/* 전체 레이아웃 컨테이너 */
.jenkins-blue-ocean-light-container {
    /* 전체 배경색: Blue Ocean UI의 밝은 회색 계열 */
    background-color: #f7f7f7; /* Light Mode 배경 */
    height: 100vh; /* 뷰포트 전체 높이 */
    width: 100%;
    padding: 15px; /* 전체 영역에 여백 추가 */
}

/* 각각의 영역(Header, Status, Log)을 위한 Card 스타일 */
.jenkins-card {
    /* 카드를 하얗게, 입체적인 효과를 위해 box-shadow 적용 */
    background-color: #ffffff;
    border-radius: 8px; /* 둥근 모서리 */
    /* 입체적인 효과를 위한 그림자: 약간 뜨는 느낌 */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05);
    width: 100%;
    overflow: hidden; /* 내부 컨텐츠가 Card 밖으로 나가지 않도록 */
}
</style>