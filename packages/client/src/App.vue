<script setup>
import { ref } from 'vue';
import { XddButton } from '@healwrap/fe-oj-components';
import { XddInput } from '@healwrap/fe-oj-components/input';
// import { Button } from 'ant-design-vue';
const types = ref(['primary', 'default', 'dashed', 'text', 'link']);
</script>

<template>
  <div class="container">
    <div class="anniu">
      <p>按钮</p>
      <xdd-button v-for="(type, index) in types" :key="index" :type="type">
        455677</xdd-button
      >
    </div>
    <div class="input">
      <xdd-input></xdd-input>
    </div>
    <Button type="primary">Ant Design Button</Button>
  </div>
</template>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.container {
  width: 800px;
  height: 800px;
  background-color: wheat;
  padding-top: 20px;
  /* 可以添加样式 */
  .anniu {
    width: 600px;
    height: 100px;
    background-color: #fff;
    margin: 0 auto;
  }
  .input {
    width: 600px;
    height: 400px;
    background-color: #fff;
    margin: 20px auto;
  }
}
</style>
