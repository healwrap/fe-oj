<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number | String,
    default: 16,
  },
  color: {
    type: Number | String,
    default: 'pink',
  },
  rotate: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <!-- 搜索图标 -->
  <div class="search">
    <i></i>
  </div>
  <!-- 等待图标 -->

  <!-- 显示密码图标 -->
</template>
<style></style>
