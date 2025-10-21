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
    currentTypes: INIALIZER.currentTypes,
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
                // console.log('data.items[idx].tree.data.stages', data.items[idx].tree.data.stages)
                onResponseDivideForBranch(res)
                
                // Total Stages 구성하기
                onResponseDivideForTotal(res)
                    
                // 2. branch 종료 후 실행 로직 : dev | main merge
                const lstIdx = res.tree.data.stages.length - 1
                if(res.tree.data.stages[lstIdx].name === 'Post Actions') {    
                    if(res.branchName === 'dev' || res.branchName === 'main') {
                        // 1. 상태 바꾸기
                        data.currentTypes = data.currentTypes.map(x => {
                            if(res.branchName.includes(x.branch)) {
                                return {
                                    ...x,
                                    status: 'success',
                                }
                            }
                            return x
                        })
                        if(res.branchName === 'main') return alert('main브랜치의 배포를 성공적으로 완료 했습니다.')

                        // dev브랜치가 성공적으로 완료 되었을 때 main브랜치로 merge진행
                        if(confirm('dev브랜치의 배포를 성공적으로 완료 했습니다.\r\ndev브랜치의 배포 자동화 작업을 진행하시겠습니까?')) {
                            GitHubAPI.mergeBranches({ baseBranch: 'main', branchNames: ['dev'] })
                                .then(() => {
                                    alert('dev브랜치를 main브랜치로 성공적으로 병합했습니다.')
                                })
                                .catch(() => {
                                    alert('브랜치 병합 중 오류가 발생했습니다.')
                                })
                        }
                    } else {
                        const featureSteps = data
                            .items[0]
                            .tree
                            .data
                            .stages
                            .filter(x => !['dev', 'main'].includes(x.name) && props.props.processItems.includes(x.id))
                        if(featureSteps.map(x => x.state !== 'success').includes(true)) {
                            // 1. 상태 바꾸기
                            data.currentTypes = data.currentTypes.map(x => {
                                if(res.branchName.split('/').includes(x.branch)) {
                                    return {
                                        ...x,
                                        status: 'success',
                                    }
                                }
                                return x
                            })
                            if(confirm('feature브랜치의 테스트를 성공적으로 완료 했습니다.\r\ndev브랜치의 배포 자동화 작업을 진행하시겠습니까?')) {
                                GitHubAPI.mergeBranches({ baseBranch: 'dev', branchNames: props.props.processItems })
                                    .then(() => {
                                        alert('feature브랜치를 dev브랜치로 성공적으로 병합했습니다.')
                                    })
                                    .catch(() => {
                                        alert('브랜치 병합 중 오류가 발생했습니다.')
                                    })
                            }
                        }
                    }

                }
            }
        },
        status: {
            currentType: data.currentType,
            currentTypeItems: data.currentTypes,
            processItems: props.props.processItems,
            tabs: headerTabs,
            currentTab: computed(() => headerTabs.find(x => data.currentItem.branchName === x.branchName)).value,
            tree: computed(() => data.currentItem.tree).value, 
            stages: computed(() => data.currentItem.tree.data.stages).value,
            isTotalProcess: computed(() => data.isTotalProcess).value,
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
    data.items = _.cloneDeep<JenkinsPipelineInfo[]>(reactive(pipelineInfoItems))
    data.currentItem = data.items[0]

    const defaultId = props.props.processItems[0]
    data.currentItem.tree.currentLogTab = defaultId
    data.currentItem.tree.currentLogItem = defaultId
    data.isTotalProcess = true

    console.log('props', props.props.processItems)
}

function onResponseDivideForBranch(res: JenkinsPipelineInfo) {
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
}

function onResponseDivideForTotal(res: JenkinsPipelineInfo) {
    const TotalItem = data.items.find(x => x.branchName === 'Total');
    const TotalStages = TotalItem.tree.data.stages
    const StagesIdx = TotalStages.findIndex(x => x.id === res.branchName);
    const lstIdx = res.tree.data.stages.length - 1
    if(StagesIdx !== -1) {
        const changeStage = {
            ...TotalStages[StagesIdx],
            title: res.tree.data.stages[lstIdx].title,
            state: res.tree.data.stages[lstIdx].name === 'Post Actions' ? 'success' : res.tree.data.stages[lstIdx].state,
            totalDurationMillis: res.tree.data.stages.reduce((acc, x) => acc + (x.totalDurationMillis || 0), 0),
        }
        data.items[0].tree.data.stages[StagesIdx] = _.cloneDeep(reactive(changeStage))
    }
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