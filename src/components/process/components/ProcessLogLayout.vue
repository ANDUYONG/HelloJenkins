<script setup lang="ts"></script>
<template>
    <div class="flex flex-row">
        <div class="min-w-0 basis-1/5">
            <slot name="Tab"></slot>
        </div>
        <div class="basis-4/5 px-[20px] py-[13px] overflow-scroll">
            <slot name="Log"></slot>
        </div>
    </div>
</template>