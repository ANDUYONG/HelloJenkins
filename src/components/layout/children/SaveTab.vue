<script setup lang="ts">
    import { inject } from 'vue';
    import { LeftArea } from '../provider/LayoutDataProvider.vue';

    const data = inject<LeftArea>('leftArea')

    function selectedTabColor(name: string) {
        return `background: ${ data.selectedSavedTab === name ? 'yellow' : undefined };`
    }

    function onClick(name: string) {
        data.selectedSavedTab = name
    }
</script>
<template>
    <div class="m-[2px] flex flex-wrap gap-[1px] mt-[10px] mb-[5px] bg-[#282d36]">
        <template v-for="{ name } in data.select">
            <button @click="onClick(name)" class="flex justify-center" :style="selectedTabColor(name)">
                {{ name }}
            </button>
        </template>
    </div>
</template>