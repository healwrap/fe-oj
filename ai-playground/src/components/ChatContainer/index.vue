<template>
  <div class="chat-messages">
    <MessageContainer
      v-for="(message, index) of messages"
      :key="index"
      :index="index"
      :loading="!message.content && loading"
      :role="message.role"
      :show-reasoning="true"
      :usage="message.usage"
    >
      <template #content>
        <!-- 文字内容 -->
        <template v-if="typeof message.content === 'string'">
          <template v-if="message.role === 'user'">{{ message.content }}</template>
          <MarkdownPreview v-else :value="message.content" />
        </template>
        <!-- 图片 -->
        <!-- 视频 -->
        <!-- 语音 -->
      </template>
      <template #reasoningText>
        <MessageReason :text="message.reasoning_content" />
      </template>
    </MessageContainer>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import MessageContainer from '@/components/MessageContainer/index.vue';
import MessageReason from '@/components/MessageReason/index.vue';
import MarkdownPreview from '@/components/MarkdownPreview/index.vue';

const { model } = defineProps<{
  model: Model;
}>();
const messages = defineModel<Message[]>('messages');
const loading = defineModel<boolean>('loading');

const apiKey = inject('apiKey');
const abortController = ref<AbortController | null>(null);

// 取消当前请求
const cancelMessage = () => {
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;

    // 更新最后一条消息
    if (messages.value.length > 0) {
      const lastMsg = messages.value[messages.value.length - 1];
      if (lastMsg.role === 'assistant' && !lastMsg.content) {
        lastMsg.content = '(回复已取消)';
      }
    }
    loading.value = false;
  }
};

const callLLMApi = async (messagesData, onUpdate) => {
  try {
    // 创建新的AbortController
    abortController.value = new AbortController();

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: messagesData.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        model,
        stream: true,
        stream_options: {
          include_usage: true,
        },
      }),
      signal: abortController.value.signal,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `HTTP error ${response.status}`
      );
    }

    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let reasoningText = '';
    let usageInfo = null;

    while (true) {
      // 如果已取消，则退出循环
      if (!abortController.value) {
        reader.cancel();
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      // 解码接收到的数据块
      buffer += decoder.decode(value, { stream: true });

      // 处理数据行
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留最后一个可能不完整的行

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            // 提取内容
            const content =
              parsed.choices?.[0]?.delta?.content ||
              parsed.choices?.[0]?.message?.content ||
              '';

            // 提取思考过程
            const reasoningContent =
              parsed.choices?.[0]?.delta?.reasoning_content ||
              parsed.choices?.[0]?.message?.reasoning_content;

            // 捕获 usage 信息 (通常在最后一个块中)
            if (parsed.usage) {
              usageInfo = parsed.usage;
            }

            if (content) {
              fullText += content;
            }

            if (reasoningContent) {
              reasoningText += reasoningContent;
            }

            onUpdate(fullText, reasoningText, usageInfo);
          } catch (e) {
            console.error('解析SSE数据失败:', e, line);
          }
        }
      }
    }

    return { fullText, reasoningText, usage: usageInfo };
  } catch (error) {
    // 如果是取消错误，则不抛出
    if (error.name === 'AbortError') {
      console.log('请求已取消');
      return { fullText: '', reasoningText: '' };
    }
    console.error('API调用失败:', error);
    throw error;
  } finally {
    // 清除 abortController
    abortController.value = null;
  }
};

const sendMessage = async (message: string) => {
  if (!message.trim() || loading.value) return;

  // 添加用户消息
  const userMessage = { role: 'user', content: message } as const;
  messages.value.push(userMessage);
  loading.value = true;

  try {
    // 创建临时消息占位
    const tempIndex = messages.value.length;
    messages.value.push({
      role: 'assistant',
      content: '',
      reasoning_content: '',
    });

    // 调用流式API并处理响应
    await callLLMApi(
      [...messages.value.slice(0, -1)],
      (content, reasoningContent, usage) => {
        // 更新最后一条消息内容
        messages.value[tempIndex].content = content;
        if (reasoningContent) {
          messages.value[tempIndex].reasoning_content = reasoningContent;
        }
        if (usage) {
          messages.value[tempIndex].usage = usage;
        }
      }
    );
  } catch (error) {
    console.error('调用AI API出错:', error);
    messages.value.push({
      role: 'assistant',
      content: '抱歉，发生了一些错误，请稍后再试。',
    });
  } finally {
    loading.value = false;
  }
};

// 暴露方法
defineExpose({ sendMessage, cancelMessage });
</script>

<style lang="scss" scoped>
@use '@/var.scss' as *;

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}
</style>
