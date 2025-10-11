<script setup lang="ts">
    const dataList = [
        {
            step: 'Checkout'
        },
        {
            step: 'Build'
        },
        {
            step: 'Test'
        },
        {
            step: 'Deploy'
        },
        {
            step: 'Total'
        },
        {
            step: '---아래는 total탭일 경우---'
        },
        {
            step: 'feature/test1'
        },
        {
            step: 'feature/test2'
        },
        {
            step: 'feature/test3'
        },
        {
            step: 'feature/test4'
        },
    ]
</script>
<template>
    <div class="flex flex-col">
        <template v-for="{ step } in dataList">
            <div class="flex justify-center py-[5px] cursor-pointer">
                {{ step }}
            </div>
        </template>
    </div>
</template>