<template>
    <div class="circle-dots">
    <span class="dot" style="--i:0;">•</span>
    <span class="dot" style="--i:1;">•</span>
    <span class="dot" style="--i:2;">•</span>
    <span class="dot" style="--i:3;">•</span>
    <span class="dot" style="--i:4;">•</span>
    <span class="dot" style="--i:5;">•</span>
    <span class="dot" style="--i:6;">•</span>
    <span class="dot" style="--i:7;">•</span>
    </div>
</template>

<style scoped>
.circle-dots {
  position: relative;
  width: 10px;
  height: 10px;
  margin: 0px auto;
}

.dot {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 8px;
  transform: rotate(calc(var(--i) * 45deg)) translate(8px) rotate(calc(var(--i) * -45deg));
}

</style>