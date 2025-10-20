<script setup lang="ts"></script>
<template>
    <div class="flex flex-ro h-full">
        <div class="min-w-0 basis-1/5">
            <slot name="Tab"></slot>
        </div>
        <div class="basis-4/5 flex flex-col min-h-0">
                <!-- 3. 이 div가 남은 수직 공간을 모두 차지하고 (flex-grow) 수직 스크롤을 담당합니다. -->
            <div class="flex-grow min-h-0 overflow-y-auto">
                <slot name="Log"></slot>
            </div>
        </div>
    </div>
</template>