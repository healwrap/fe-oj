<script setup>
import { ref } from 'vue';

const styles = ref(['outlined', 'filled', 'borderless', 'underlined']);
</script>

<template>
  <div class="xdd-input-wrapper">
    <!-- 前置插槽 -->
    <!-- $slot是一个对象，包含了插槽的所有引用 -->
    <div v-if="$slots.prefix" class="xdd-input-prefix">
      <slot name="prefix"></slot>
    </div>

    <input
      v-for="style in styles"
      :key="`${style}`"
      :type="type"
      :class="['xdd-input', `xdd-input-${style}`]"
      :placeholder="style"
    />

    <!-- 后置插槽 -->
    <div v-if="$slots.suffix" class="xdd-input-suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.xdd-input-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;

  .xdd-input-prefix {
    position: absolute;
    left: 12px;
    color: #999;
    display: flex;
    align-items: center;
  }

  .xdd-input-suffix {
    position: absolute;
    right: 12px;
    color: #999;
    display: flex;
    align-items: center;
  }

  .xdd-input {
    margin: 10px;
    padding: 8px;
    outline: none; // 移除默认的focus outline
    transition: all 0.5s; // 添加过渡效果

    // 有前缀图标时添加左内边距
    &.has-prefix {
      padding-left: 32px;
    }

    // 有后缀图标时添加右内边距
    &.has-suffix {
      padding-right: 32px;
    }

    &-outlined {
      border: 1.5px solid #ccc;
      border-radius: 4px;
      &:hover {
        border-color: pink;
      }
      &:focus {
        border-color: pink color.adjust($color: pink, $lightness: 80%);
        box-shadow: 0 0 6px rgba(rgb(216, 136, 178), 0.7); // 添加发光效果
      }
    }

    &-filled {
      border: none;
      background-color: #e6e3e3;
      border-radius: 4px;
      &:hover {
        background-color: #c7c5c5;
      }
      &:focus {
        border: 1px solid pink;
      }
    }

    &-borderless {
      border: none;
      background-color: transparent;
    }

    &-underlined {
      border: none;
      border-bottom: 1px solid #ccc;
      background-color: transparent;
    }
  }
}
</style>
