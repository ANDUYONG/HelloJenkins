<script setup lang="ts">
    const dataList = [
        {
            val: '1',
            name: 'test1',
        },
        {
            val: '2',
            name: 'test2',
        },
        {
            val: '3',
            name: 'test3',
        },
        {
            val: '4',
            name: 'test4',
        },
        {
            val: '4',
            name: 'test4',
        },
        {
            val: '4',
            name: 'test4',
        },
        {
            val: '4',
            name: 'test4',
        },
    ]
</script>
<template>
    <div class="m-[2px] flex flex-wrap gap-[1px] ">
        <template v-for="{ name } in dataList">
            <button class="flex justify-center">
                {{ name }}
            </button>
        </template>
    </div>
</template>