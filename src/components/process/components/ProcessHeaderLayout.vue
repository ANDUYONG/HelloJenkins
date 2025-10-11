<script></script>
<template>
    <div class="flex flex-col p-[10px] size-full">
        <!-- 제목 영역 -->
        <div class="flex flex-col flex-2">
            <div class="flex flex-row flex-2">
                <div class="flex-1">
                    <slot name="TopLeft"></slot>
                </div>
                <div class="flex-1">
                    <slot name="TopCenter"></slot>
                </div>
                <div class="flex-1">
                    <slot name="TopRight"></slot>
                </div>
            </div>
            <!-- 부제 영역 -->
            <div class="flex-1 pl-[10px]">
                <h3>
                    <slot name="SubTitle"></slot>
                </h3>
            </div>
        </div>
        <div class="flex flex-5">
            <!-- 헤더 영역: 바로 가기 링크 -->
            <div class="basis-1/4">
                <slot name="Header"></slot>
            </div>

            <!-- 컨텐트 영역 -->
            <div class="basis-3/4">
                <slot name="Content"></slot>
            </div>
        </div>
        <!-- 하단 영역 -->
        <div class="flex flex-1">
            <slot name="Footer"></slot>
        </div>
    </div>
</template>