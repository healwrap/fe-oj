<template>
  <div class="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/var.scss' as *;
// 加载动画
.typing-indicator {
  display: flex;
  align-items: center;
  margin-left: 8px; // 添加左边距，让动画和文本分开

  span {
    height: 8px;
    width: 8px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    display: inline-block;
    margin: 0 2px;

    animation: typing 1.5s infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.3s;
    }

    &:nth-child(3) {
      animation-delay: 0.6s;
    }
  }
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}
</style>
