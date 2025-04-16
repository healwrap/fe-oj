<script lang="ts" setup>
import { ref } from 'vue';
import ChatContainer from '@/components/ChatContainer/index.vue';

const inputMessage = ref('');
const messages = ref([]);
const loading = ref(false);

const chatContainerRef = ref<InstanceType<typeof ChatContainer>>(null);

const sendMessage = () => {
  chatContainerRef.value.sendMessage(inputMessage.value);
  inputMessage.value = '';
};

const cancelMessage = () => {
  chatContainerRef.value.cancelMessage();
};
</script>

<template>
  <div class="ai-playground-app">
    <header class="chat-header">
      <h1>AI模型测试</h1>
    </header>

    <main class="chat-container">
      <ChatContainer
        v-model:messages="messages"
        v-model:loading="loading"
        model="qwq-32b"
        ref="chatContainerRef"
      />
    </main>

    <footer class="chat-input-container">
      <div class="chat-input-wrapper">
        <textarea
          v-model="inputMessage"
          placeholder="输入您的问题..."
          @keydown.enter.prevent="sendMessage"
          rows="1"
          class="chat-input"
        ></textarea>

        <!-- 根据加载状态显示不同按钮 -->
        <button
          v-if="!loading"
          @click="sendMessage"
          :disabled="!inputMessage.trim()"
          class="send-button"
          title="发送"
        >
          <span class="send-icon">↑</span>
        </button>
        <button
          v-else
          @click="cancelMessage"
          class="cancel-button"
          title="取消"
        >
          <span class="cancel-icon">✕</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use '@/var.scss' as *;

.ai-playground-app {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2 * 10px);
  width: 1200px;
  border: 2px solid #cdcdcda0;
  box-sizing: border-box;
  border-radius: 10px;
  margin: 10px 0;
  font-family:
    'Inter',
    'Segoe UI',
    -apple-system,
    BlinkMacSystemFont,
    Roboto,
    Oxygen,
    Ubuntu,
    sans-serif;
  color: $text-color;
  background-color: $bg-color;

  @media (max-width: 1200px) {
    width: 100%;
    height: 100vh;
    margin: 0;
    border: none;
    border-radius: 0;
  }
}

// 头部样式
.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid $border-color;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    color: $primary-color;
  }
}

// 主聊天区域
.chat-container {
  flex: 1;
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

// 输入区域
.chat-input-container {
  padding: 16px 24px;
  border-top: 1px solid $border-color;
}

.chat-input-wrapper {
  display: flex;
  background-color: $assistant-color;
  border-radius: $border-radius-small;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  .chat-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px 12px;
    font-size: 15px;
    resize: none;
    outline: none;
    font-family: inherit;

    &::placeholder {
      color: $text-light;
    }
  }

  .send-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: $primary-color;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;

    &:disabled {
      background-color: color-mix(in srgb, $primary-color 75%, white);
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: $primary-color-dark;
    }

    .send-icon {
      font-size: 18px;
    }
  }

  .cancel-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #e74c3c;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #c0392b;
    }

    .cancel-icon {
      font-size: 18px;
    }
  }
}
</style>
