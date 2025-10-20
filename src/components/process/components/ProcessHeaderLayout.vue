<script></script>
<template>
    <div class="flex flex-col p-[10px] size-full process-layout-container">
        <div class="flex flex-col flex-2 internal-area-bottom-border">
            <div class="flex flex-row flex-2">
                <div class="flex-1">
                    <slot name="TopLeft"></slot>
                </div>
                <div class="flex-1 internal-area-left-border">
                    <slot name="TopCenter"></slot>
                </div>
                <div class="flex-1 internal-area-left-border">
                    <slot name="TopRight"></slot>
                </div>
            </div>
            <div class="flex-1 pl-[10px] sub-title-area">
                <h3>
                    <slot name="SubTitle"></slot>
                </h3>
            </div>
        </div>
        <div class="flex flex-5 content-area">
            <div class="basis-1/4 internal-area-right-border">
                <slot name="Header"></slot>
            </div>

            <div class="basis-3/4">
                <slot name="Content"></slot>
            </div>
        </div>
        <div class="flex flex-1 internal-area-top-border footer-area">
            <slot name="Footer"></slot>
        </div>
    </div>
</template>
<style scoped>
.process-layout-container {
    font-family: Arial, sans-serif;
    color: #333;
}
/* 내부 영역 구분선 (요청된 border) */
.internal-area-bottom-border {
    border-bottom: 1px solid #eeeeee; 
    padding-bottom: 10px;
    margin-bottom: 10px;
}
.internal-area-left-border {
    border-left: 1px solid #eeeeee; 
    padding-left: 10px;
}
.internal-area-right-border {
    border-right: 1px solid #eeeeee; 
    padding-right: 10px;
}
.internal-area-top-border {
    border-top: 1px solid #eeeeee; 
    padding-top: 10px;
    margin-top: 10px;
}
/* 추가 스타일링 */
.sub-title-area h3 {
    font-size: 1.1em;
    font-weight: 500;
    color: #555;
    margin: 0;
}
</style>