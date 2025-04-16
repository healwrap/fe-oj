<template>
  <div class="reasoning-content">
    <details open>
      <summary>思考过程</summary>
      <div class="reasoning-text">{{ text }}</div>
    </details>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    text: string;
  }>(),
  { text: '' }
);
</script>

<style lang="scss" scoped>
@use '@/var.scss' as *;

// 思考过程样式
.reasoning-content {
  margin-top: 8px;
  font-size: 14px;

  details {
    summary {
      color: $primary-color;
      font-weight: 500;
      user-select: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .reasoning-text {
    max-width: 100%;
    width: fit-content;
    margin-top: 8px;
    padding: 8px 12px;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 8px;
    white-space: pre-wrap;
    color: $text-light;
    font-family: monospace;
    font-size: 13px;
    line-height: 1.5;
  }
}
</style>
