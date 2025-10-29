<script setup lang="ts">
import { inject } from 'vue';
import ProcessHeaderTab from './components/children/ProcessHeaderTab.vue';
import ProcessLog from './components/children/ProcessLog.vue';
import ProcessLogTab from './components/children/ProcessLogTab.vue';
import ProcessStatus from './components/children/ProcessStatus.vue';
import ProcessTotalStatus from './components/children/ProcessTotalStatus.vue';
import ProcessHeaderLayout from './components/ProcessHeaderLayout.vue';
import ProcessLogLayout from './components/ProcessLogLayout.vue';
import ProcessStatusLayout from './components/ProcessStatusLayout.vue';
import ProcessDataProvider from './provider/ProcessDataProvider.vue';
import OverviewSocket from './socket/OverviewSocket.vue';
import ProcessSocket from './socket/ProcessSocket.vue';
import { LeftArea } from '../layout/provider/LayoutDataProvider.vue';
import ProcessTotalLog from './components/children/ProcessTotalLog.vue';
import ProcessStatusTimeLine from './components/children/ProcessStatusTimeLine.vue';

const props = inject<LeftArea>('leftArea')
</script>
<template>
    <div id="processLayout">
        <ProcessDataProvider :props="props">
            <template #Socket="{ props: { onResponse } }">
                <OverviewSocket @response="onResponse"/>
             </template>
    
            <template #Header>
                <ProcessHeaderLayout>
                    <template #TopLeft>
                        Jenkins Multibranch PipeLine Stage 실시간 모니터링
                    </template>
                    <template #TopCenter>
                    </template>
                    <template #TopRight>
                    </template>
    
                    <template #SubTitle>
                        <div class="flex gap-[15px] hj-branch-step">
                            <div>
                                브랜치 전략 :
                            </div>
                            <div>
                                feature(기능 개발: 빌드 테스트)
                            </div>
                            <div>></div>
                            <div>
                                dev(배포 및 main에 빌드 테스트)
                            </div>
                            <div>></div>
                            <div>
                                main(배포)   
                            </div>
                        </div>
                    </template>
    
                    <template #Header>
                        <div class="flex flex-col gap-[3px]">
                            <div style="font-weight: bold;">
                                테스트 시나리오
                            </div>
                            <div class="pl-[20px] flex hj-scenario-list">
                                1. 개발자 기능개발 완료 후 git repo에 push
                            </div>
                            <div class="pl-[20px] hj-scenario-list">
                                2. 자동화 빌드 및 테스트 진행
                            </div>
                            <div class="pl-[20px] hj-scenario-list">
                                3. 관리자는 Slack 빌드 성공 알림 확인
                            </div>
                            <div class="pl-[20px] hj-scenario-list">
                                4. 관리자는 dev브랜치에 merge
                            </div>
                            <div class="pl-[20px] hj-scenario-list">
                                5. QA팀 확인 > 관리자에게 결과 전달
                            </div>
                            <div class="pl-[20px] hj-scenario-list">
                                6. 관리자 결과 확인 후 main브랜치에 merge
                            </div>
                        </div>
                    </template>
                    <template #Content>
                        <div class="flex flex-col gap-[3px] pl-[15px]">
                            <div style="font-weight: bold;">
                                개발 환경 및 사용 기술
                            </div>
                            <div class="hj-stack-list">
                                <div class="hj-stack-title">
                                    OS : 
                                </div>
                                <div class="hj-stack-item">MacOS</div>
                            </div>
                            <div class="hj-stack-list">
                                <div class="hj-stack-title">
                                    Frontend : 
                                </div>
                                <div class="hj-stack-item">Vue3</div>
                                <div class="hj-stack-item">WebSocket</div>
                                <div class="hj-stack-item">Axios</div>
                                <div class="hj-stack-item">Nginx</div>
                                <div class="hj-stack-item">Typescript</div>
                            </div>
                            <div class="hj-stack-list">
                                <div class="hj-stack-title">
                                    Backend : 
                                </div>
                                <div class="hj-stack-item">SpringBoot</div>
                                <div class="hj-stack-item">Spring WebSocket</div>
                            </div>
                            <div class="hj-stack-list">
                                <div class="hj-stack-title">
                                    API : 
                                </div>
                                <div class="hj-stack-item">Github API</div>
                                <div class="hj-stack-item">Jenkins Workflow API</div>
                            </div>
                            <div class="hj-stack-list">
                                <div class="hj-stack-title">
                                    DevOps : 
                                </div>
                                <div class="hj-stack-item">Jenkins</div>
                                <div class="hj-stack-item">Docker</div>
                                <div class="hj-stack-item">Slack</div>
                                <div class="hj-stack-item">Git</div>
                                <div class="hj-stack-item">Github Webhook</div>
                                <div class="hj-stack-item">Slack Incomming Webhook</div>
                            </div>
                            <div class="hj-stack-list">
                                <div class="hj-stack-title">
                                    Version : 
                                </div>
                                <div class="hj-stack-item">node:20.19.5</div>
                                <div class="hj-stack-item">nginx:1.29.1</div>
                                <div class="hj-stack-item">Java17</div>
                            </div>
                        </div>
                    </template>
                    <template #Reference>
                        <div class="flex flex-col p-[15px] gap-[5px]">
                            <div style="font-weight: bold;">
                                Reference
                            </div>
                            <div>
                                <a class="hj-link" href="https://github.com/ANDUYONG/HelloJenkins" target="_blank">
                                    🚩 (Frontend) Git Repository
                                </a>
                            </div>
                            <div>
                                <a class="hj-link" href="https://github.com/ANDUYONG/HelloJenkinsBackend" target="_blank">
                                    🚩 (Backend) Git Repository
                                </a>
                            </div>
                        </div>
                    </template>

                    <template #Footer>
                        <div class="flex flex-col">
                            <div style="font-weight: bold; font-size: 0.9em;">
                                ※ 참고사항
                            </div>
                            <div style="color: red; font-size: 0.8em;">
                                ##Slack Channel에서 알람을 받아보고 싶다면
                                du2sam@naver.com 로 전달받을 email을 남겨주세요.##
                            </div>
                            <div class="hj-bottom-explain">
                                **Total: 각 브랜치 별 진행상태 확인 및 전체 로그 확인**
                            </div>
                            <div class="hj-bottom-explain">
                                **각 탭: StageOverview 및 타임라인**
                            </div>
                        </div>
                    </template>
                </ProcessHeaderLayout>
            </template>
    
            <template #Status="{ props: {
                processItems, tabs, onHeaderTabChange, currentTab, 
                currentType, currentTypeItems, stages, isTotalProcess
            }}">
                <ProcessStatusLayout :isTotal="isTotalProcess">
                    <template #BranchTab>
                        <ProcessHeaderTab
                            :value="currentTab"
                            :items="tabs"
                            :processItems="processItems"
                            @change="onHeaderTabChange"
                        />
                    </template>
                    <template #Header>
                        <ProcessTotalStatus
                            :value="currentType"
                            :items="currentTypeItems"
                        />
                        </template>
                        <template #Content>
                            <ProcessStatusTimeLine :isTotalProcess="isTotalProcess" :items="stages" :processItems="processItems"/>
                        </template>
                </ProcessStatusLayout>
            </template>
    
            <template #Log="{ props: { processItems, tree, isTotalProcess, currentLogItem, currentLogTab, currentStage, totalLog, onLogTabChange } }">
                <ProcessLogLayout>
                    <template #Tab>
                        <ProcessLogTab
                            :value="currentLogTab"
                            :items="tree.data.stages"
                            :processItems="processItems"
                            :isTotalProcess="isTotalProcess"
                            @change="onLogTabChange"
                        />
                    </template>
                    <template #Log>
                        <ProcessTotalLog v-if="isTotalProcess" :value="totalLog" :title="currentStage"/>
                        <ProcessLog v-else :item="currentLogItem" :title="currentStage"/>
                    </template>
                </ProcessLogLayout>
            </template>
        </ProcessDataProvider>
    </div>
</template>
<style scoped>
/* ProcessDataProvider의 높이를 100%로 설정하여 부모를 채우고 내부에서 flex-col로 배치되게 합니다. */
#processLayout { /* ProcessDataProvider */
    flex-grow: 1;
    min-height: 0;
    min-width: 100%;
}

.hj-branch-step {
    color: orange;
}

.hj-scenario-list {
    height: 20px;
    font-size: 0.9em;
    border: 1px solid #6c90d3;
    background-color: #6c90d3;
    color: white;
    border-radius: 8px;
}

.hj-bottom-explain {
    font-size: 0.9em;
    text-decoration: underline;
}

.hj-stack-list {
    display: flex;
    flex-direction: row;
    font-size: 0.8em;
    flex-wrap: wrap;
}

.hj-stack-title {
    display: inline-flex; /* 텍스트 내용에 맞게 너비 조절 및 내부 정렬 */
    align-items: center;  /* 세로 중앙 정렬 */
    justify-content: center; /* 가로 중앙 정렬 */
    padding: 4px 10px; /* 상하좌우 내부 여백 */
}

.hj-stack-item {
    display: inline-flex; /* 텍스트 내용에 맞게 너비 조절 및 내부 정렬 */
    align-items: center;  /* 세로 중앙 정렬 */
    justify-content: center; /* 가로 중앙 정렬 */
    
    padding: 4px 8px; /* 상하좌우 내부 여백 */
    
    background-color: #8393b1; /* 뱃지 배경색 (예시: 파란색) */
    color: white; /* 텍스트 색상 */
    
    border-radius: 12px; /* 모서리 둥글게 (값이 클수록 캡슐 모양) */
    font-size: 0.8em; /* 글자 크기 */
    font-weight: bold; /* 글자 두께 */
    
    /* 선택 사항: 뱃지들 간의 간격 */
    margin: 2px; 
    
    /* 선택 사항: 텍스트 장식 제거 (링크 등으로 사용될 경우) */
    text-decoration: none; 
}

.hj-link {
    text-decoration: underline;
}
</style>