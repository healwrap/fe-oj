<template>
  <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import math from '@bytemd/plugin-math';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import mermaid from '@bytemd/plugin-mermaid';
import frontmatter from '@bytemd/plugin-frontmatter';
import theme from './plugin-theme';
// @ts-ignore
import { Viewer } from '@bytemd/vue-next';

const plugins = [
  // 解析文档前端的元数据（如标题、作者、日期等）
  frontmatter(),
  // 添加LaTeX数学公式支持，配置为输出MathML格式
  math({ katexOptions: { output: 'mathml' } }),
  // 启用GitHub风格的Markdown支持（表格、任务列表、删除线等）
  gfm(),
  // 为代码块添加语法高亮功能
  highlight(),
  // 为图片添加点击放大预览功能
  mediumZoom(),
  // 支持渲染Mermaid图表（流程图、时序图等）
  mermaid(),
  // 自定义主题插件
  theme({
    theme: 'juejin', // 默认掘金主题
    highlight: 'github', // 默认代码高亮样式
  }),
];
defineProps<{ value: string }>();
</script>

<style>
code {
  font-family:
    SFMono-Regular,
    Consolas,
    Liberation Mono,
    Menlo,
    monospace;
}
</style>
