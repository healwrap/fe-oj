# FE OJ

## 1. 项目简介

FE OJ 是一个面向前端开发者的在线编程练习平台，旨在帮助前端开发者提升编程能力，提供了大量的编程题目，涵盖了前端开发中的各个知识点，包括但不限于 HTML、CSS、JavaScript 等。同时项目支持本地运行无需后端服务，即可 实现编程练习

## 2. 项目功能

因为项目是本地运行的，所以仅支持 JavaScript 语言

主要功能如下：

1. 算法编程
   - 主要是一些热门算法题目，支持在线测试
2. 语法练习
   - 一些手写代码，比如手写`new`、`instanceof`、`call`、`JSON.stringify`等
3. HTML、CSS 练习
   - 一些常见的 HTML、CSS 题目，比如盒模型、布局等

其他功能：

1. 代码提交记录
   - 项目支持本地保存用户的代码，当用户提交代码后，会在浏览器中储存代码，用户可以查看之前的提交记录和代码
2. 代码自动保存
   - 项目支持代码自动保存，用户在编写代码时，代码会自动保存到浏览器中，用户可以随时刷新页面，代码不会丢失
3. 执行代码和预览结果
   - 用户可以在页面上直接执行代码，查看代码的运行结果
   - 项目支持代码预览，用户可以直接查看页面效果
4. 参考答案
   - 用户可以查看题目的参考答案

## 3. 本地运行代码的思路

1. 执行 js 代码

> 1. 可以利用`eval`函数、或者`new Function`函数执行代码
> 2. `eval`和`new Function` 执行代码时，作用域会有些区别
>
> - `eval`执行的代码会在当前作用域中执行，可以访问当前作用域中的变量
> - `new Function`创建的函数，无法获取到外部的作用域的变量，只能访问全局作用域(window)中的变量
> - 相比较而言`new Function`会更加安全一些
>
> ```js
> // 使用 eval
> (function () {
>   var localVar = 'local';
>   eval('console.log(localVar)'); // 输出 'local'
> })();
>
> // 使用 new Function
> (function () {
>   var localVar = 'local';
>   var func = new Function('console.log(typeof localVar, typeof  globalThis)'); // 输出 'undefined' 'object'
>   func();
> })();
> ```
>
> 3. 为了防止代码执行过度阻塞主线程，可以使用`web worker`来执行代码，包括执行代码可以使用最大并发任务管理(作为拓展点了，暂时不考虑)

2. 判断 JS 代码是否执行正确

> 利用预先准备的测试用例，判断代码的执行结果是否和预期一致

3. 预览 html、css 代码

> 可以利用`iframe`标签预览 html、css 代码

4. 判断 html、css 代码是否正确(比较难实现，但是可以实现预览代码效果)

> 利用 DOM 操作和样式检测操作，判断页面结果是否和预期一致

5. 保存用户数据/代码

> 可以利用`localStorage`或者`indexDB`保存用户数据/代码

## 4. 结合AI

项目中的题目都是结构化的，比如可能是这样的

```js
 problem1: {
   title: '问题 #1：实现加法函数',
   description: '编写一个函数 sum，接受两个数字参数并返回它们的和',
   initialCode: `function sum(a, b) {\n    // 你的代码\n}`,
   testCases: [
   { args: [1, 2], expected: 3 },
   { args: [5, -3], expected: 2 },
   ],
   funcName: 'sum',
   params: ['a', 'b'],
},
```

对于系统中不够的题目，可以让AI生成
