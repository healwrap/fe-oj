declare type Message = {
  role: 'user' | 'assistant';
  content: string | {};
  reasoning_content?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// 文字内容
declare type TextContent = 'string'

// 图片内容


declare type Model = 'qwq-32b' | 'qwen-plus';

declare type RequestBody = {
  messages: Message[];
  model: Model;
  stream: boolean;
  stream_options: { include_usage: boolean };
};
