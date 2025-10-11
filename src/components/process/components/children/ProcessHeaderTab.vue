<script setup lang="ts">
    const dataList = [
        {
            id: 1,
            title: 'total',
        },
        {
            id: 2,
            title: 'feature/test1',
        },
        {
            id: 3,
            title: 'feature/test2',
        },
        {
            id: 4,
            title: 'feature/test3',
        },
        {
            id: 5,
            title: 'feature/test4',
        },
        // {
        //     id: 6,
        //     title: 'feature/test5',
        // },
    ]
</script>
<template>
    <div class="flex flex-1">
        <template v-for="{ title } in dataList">
            <div class="flex justify-center items-center cursor-pointer basis-1/6">
                {{ title }}
            </div>
        </template>
    </div>
</template>