<script setup lang="ts">
import { ref } from 'vue';
import type { LeftArea } from '@/components/layout/provider/LayoutDataProvider.vue';

export interface ProcessDataProviderProps {
    props: LeftArea
}

export interface Socket {
    process: ProcessSocket
}
export interface ProcessSocket {}
export interface OverviewSocket {}

const props = defineProps<ProcessDataProviderProps>()
</script>
<template>
    <div class="flex flex-col min-h-screen w-screen">
        <div class="flex h-[350px]">
            <slot name="Header"></slot>
        </div>
        <div class="flex h-[350px]">
            <slot name="Status"></slot>
        </div>
        <div class="flex flex-4 min-h-0">
            <div class="grow">
                <slot name="Log"></slot>
            </div>
        </div>
        <div :data="props.props" class="hidden">
            <slot name="Socket"></slot>
        </div>
    </div>
</template>

<style setup>
    div {
        background: aliceblue;
        border: 1px solid black;
        color: black;
    }
</style>