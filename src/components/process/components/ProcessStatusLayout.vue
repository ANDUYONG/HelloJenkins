<script></script>
<template>
    <div class="flex flex-col p-[10px] size-full">
        <!-- 제목 영역 -->
        <div class="flex flex-col">
            <div class="flex grow h-[50px]">
                <slot name="BranchTab"></slot>
            </div>
        </div>
        <div class="flex flex-5">
            <!-- 헤더 영역: 바로 가기 링크 -->
            <div class="basis-1/3">
                <slot name="Header"></slot>
            </div>

            <!-- 컨텐트 영역 -->
            <div class="basis-2/3">
                <slot name="Content"></slot>
            </div>
        </div>
    </div>
</template>