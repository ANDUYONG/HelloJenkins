<script setup lang="ts">
    const defaultItem = {
        val: '',
        name: '-- 브랜치를 선택해주세요. --',        
    }
    const dataList = [
        {
            val: '1',
            name: 'feature/test1',
        },
        {
            val: '2',
            name: 'feature/test2',
        },
        {
            val: '3',
            name: 'feature/test3',
        },
        {
            val: '4',
            name: 'feature/test4',
        },
        {
            val: 'etc',
            name: '새 브랜치',
        },
    ]
</script>
<template>
    <div class="flex">
        <select class="grow p-[3px]">
            <option :value="defaultItem.val">
                <span class="font-bold">
                    {{ defaultItem.name }}
                </span>
            </option>
            <template v-for="{ val, name } in dataList">
                <option :value="val">
                    <span class="font-bold">
                        {{ name }}
                    </span>
                </option>
            </template>
        </select>
    </div>
</template>