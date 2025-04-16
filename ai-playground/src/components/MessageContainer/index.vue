<template>
  <div
    :class="[
      'message-wrapper',
      role === 'user' ? 'user-wrapper' : 'assistant-wrapper',
    ]"
  >
    <!-- 头像 -->
    <div class="avatar">
      <div class="avatar-icon">
        {{ role === 'user' ? '👤' : '🤖' }}
      </div>
    </div>
    <!-- 消息 -->
    <div
      :class="[
        'message',
        role === 'user' ? 'user-message' : 'assistant-message',
      ]"
    >
      <div class="message-content-wrapper">
        <!-- 显示token使用量 -->
        <div v-if="usage" class="usage">
          {{
            JSON.stringify(
              Object.entries(usage).map(([k, v]) => [k, formatNumber(v)])
            )?.replace(/[{}""\[\]]/g, '')
          }}
        </div>
        <!-- 显示加载中 或者 内容插槽 -->
        <div
          class="message-content"
          :class="{
            'loading-container': role === 'assistant' && loading,
          }"
        >
          <!-- 内容插槽 插入文本/图片/语音/视频 等，失败使用兜底处理 -->
          <MessageLoading v-if="role === 'assistant' && loading" />
          <slot v-else name="content"></slot>
        </div>
      </div>

      <!-- 思考过程 -->
      <slot
        v-if="showReasoning && role === 'assistant' && $slots.reasoningText"
        name="reasoningText"
      ></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MessageLoading from '@/components/MessageLoading/index.vue';
import { formatNumber } from '@/utils';

withDefaults(
  defineProps<{
    loading: boolean;
    showReasoning: boolean;
    role?: 'user' | 'assistant';
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }>(),
  {
    loading: false,
    showReasoning: false,
  }
);
</script>

<style lang="scss" scoped>
@use '@/var.scss' as *;

// 消息样式
.message-wrapper {
  display: flex;
  margin-bottom: 24px;

  &.user-wrapper {
    justify-content: flex-end;

    .avatar {
      order: 2;
      margin-left: 12px;
      margin-right: 0;
    }
  }

  &.assistant-wrapper {
    justify-content: flex-start;

    .avatar {
      margin-right: 12px;
    }
  }

  // 头像样式
  .avatar {
    width: 36px;
    height: 36px;

    .avatar-icon {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f0f2f5;
      font-size: 18px;
    }
  }

  // 消息样式
  .message {
    max-width: 70%;

    .message-content-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .usage {
      position: absolute;
      transform: translateY(-125%);
      font-size: 14px;
      color: #808080;
    }

    .message-content {
      max-width: 100%;
      width: fit-content;
      padding: 12px 16px;
      border-radius: $border-radius;
      font-size: 15px;
      line-height: 1.5;
      word-wrap: break-word;

      &.loading-container {
        display: flex;
        align-items: center;
      }
    }

    &.user-message .message-content {
      background-color: $primary-color;
      color: white;
      border-radius: $border-radius;
      border-bottom-right-radius: 4px;
    }

    &.assistant-message .message-content {
      background-color: $assistant-color;
      color: $text-color;
      border-radius: $border-radius;
      border-bottom-left-radius: 4px;
    }
  }
}
</style>
