<script setup lang="ts">
import { inject } from 'vue';
import { INIALIZER, PipelineStage } from './provider/process-data';
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

const props = inject<LeftArea>('leftArea')
</script>
<template>
    <ProcessDataProvider :props="props">
        <!-- 소켓 -->
         <template #Socket="{ props: { onResponse } }">
            <OverviewSocket @response="onResponse"/>
            <ProcessSocket/>
         </template>

        <!-- 헤더 -->
        <template #Header>
            <ProcessHeaderLayout>
                <!-- 상단 영역: 제목 설정 -->
                <template #TopLeft>
                    left
                </template>
                <template #TopCenter>
                    center
                </template>
                <template #TopRight>
                    right
                </template>

                <!-- 부제 영역 -->
                 <template #SubTitle>
                    부제
                 </template>

                <!-- 컨텐트 영역: 헤더, 컨텐트 -->
                 <template #Header>
                    헤더
                 </template>
                 <template #Content>
                    컨텐트
                 </template>

                 <!-- 하단 영역 -->
                  <template #Footer>
                    하단 영역
                  </template>
            </ProcessHeaderLayout>
        </template>

        <!-- 브랜치 별 상태 표시 -->
        <template #Status="{ props: {
            processItems, tabs, onHeaderTabChange, currentTab
        }}">
            <ProcessStatusLayout>
                <!-- 상단 영역: 제목 설정 -->
                <template #BranchTab>
                    <ProcessHeaderTab
                        :value="currentTab"
                        :items="tabs"
                        :processItems="processItems"
                        @change="onHeaderTabChange"
                    />
                </template>
                <!-- 컨텐트 영역: 헤더, 컨텐트 -->
                 <template #Header>
                    <ProcessTotalStatus/>
                    <ProcessStatus/>
                 </template>
                 <template #Content>
                    <div>전체 진행현황 테이블</div>
                    <div>개별 진행현황 타임라인</div>
                 </template>
            </ProcessStatusLayout>
        </template>

        <!-- Log 영역 -->
        <template #Log="{ props: { processItems, tree, isTotalProcess, currentLogItem, currentLogTab, currentStage, onLogTabChange } }">
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
                    <ProcessLog :item="currentLogItem" :title="currentStage"/>
                </template>
            </ProcessLogLayout>
        </template>
    </ProcessDataProvider>
</template>