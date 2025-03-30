<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
});
</script>

<template>
  <button :class="['xdd-button', `xdd-button-${type}`]">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.xdd-button {
  position: relative;
  padding: 15px 20px;
  text-align: center;
  border: 1px black solid;
  border-radius: 10px;
  font-size: 18px;
  color: white;
  // box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
  cursor: pointer;

  // &:hover {
  //   box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.4);
  // }

  &::before {
    content: '';
    position: absolute;
    box-sizing: content-box;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border-radius: inherit;
    outline: 2px solid rgb(173, 163, 164);
    opacity: 0;
    pointer-events: none;
  }

  &:active::before {
    animation: rippleOut 0.5s;
  }

  &:active {
    transform: scale(0.98); // 点击时略微缩小
    opacity: 0.8; // 点击时降低透明度
  }

  // primary 样式
  &-primary {
    border: none;
    background-color: rgb(233, 166, 199);
    &:hover {
      background-color: pink;
    }
    &:active {
      background-color: color.adjust(
        rgb(233, 166, 199),
        $lightness: -10%
      ); // 使用新的颜色调整方法
    }
  }

  // 默认样式
  &-default {
    border: 1px rgb(202, 196, 196) solid;
    background-color: #fff;
    color: black;
    &:hover {
      border-color: rgb(233, 166, 199);
      color: rgb(233, 166, 199);
    }
  }

  // 虚线按钮
  &-dashed {
    border: 1px rgb(202, 196, 196) dashed;
    background-color: #fff;
    color: black;
    &:hover {
      border-color: rgb(233, 166, 199);
      color: rgb(233, 166, 199);
    }
  }

  &-text {
    border: none;
    background-color: #fff;
    color: black;
    &:hover {
      background-color: rgb(222, 211, 211);
    }
    &:active {
      background-color: darkgray; // 点击时加深背景色
    }
  }

  &-link {
    border: none;
    background-color: #fff;
    color: rgb(233, 166, 199);
    &:hover {
      color: rgb(248, 219, 234);
    }
  }
}

@keyframes rippleOut {
  0% {
    outline-width: 2px;
    opacity: 0;
  }

  50% {
    outline-width: 5px;
    opacity: 1;
  }

  // 100% {
  //   outline-width: 10px;
  //   opacity: 0;
  // }
}
</style>
