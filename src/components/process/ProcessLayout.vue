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
                        left
                    </template>
                    <template #TopCenter>
                        center
                    </template>
                    <template #TopRight>
                        right
                    </template>
    
                    <template #SubTitle>
                        부제
                        </template>
    
                    <template #Header>
                        헤더
                    </template>
                    <template #Content>
                        컨텐트
                    </template>

                    <template #Footer>
                        하단 영역
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
                        <ProcessStatus/>
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
</style>