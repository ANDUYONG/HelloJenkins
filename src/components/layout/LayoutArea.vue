<script setup>
import LeftArea from './LeftArea.vue';
import MainArea from './MainArea.vue';
import LayoutDataProvider from './provider/LayoutDataProvider.vue';
import ProcessLayout from '../process/ProcessLayout.vue';
</script>

<template>
    <LayoutDataProvider>
        <!-- 왼쪽 영역 : 트리 메뉴, 변경 파일 목록 -->
        <template #leftArea="{ data }">
            <LeftArea/>
        </template>
        <!-- 중앙 영역 : 코드 에디터, 파일 내용 표시 -->
        <template #mainArea="{ data }">
            <MainArea/>
        </template>
        <!-- 숨겨진 영역 : 이후 프로세스 -->
        <template #hidden="{ data: { isShowProcess } }">
            <!-- <Progress v-if="isVisible" @close="isVisible = false"/>  -->
            <ProcessLayout v-if="isShowProcess"/> 
        </template>
    </LayoutDataProvider>
</template>