---
title: Vue3组件库全局注册时类型声明
date: 2024-10-11
componentName: LibGlobalTypeError
tags:
  - Vue
  - TypeScript
  - 全局类型声明
---

# Vue3组件库全局注册时类型声明

[[toc]]

最近搭建的Vue3组件库，在全局注册时，遇到了类型声明的问题。

## 1. 问题描述

在全局注册时，我们需要在`main.ts`中导入组件，并通过`app.use()`方法注册组件。

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import HonyUI from 'hony-ui'

const app = createApp(App)
app.use(HonyUI)
app.mount('#app')
```

但是，在使用组件时，发现类型提示报错：

```html
<template>
  <hony-button>按钮</hony-button>
</template>

<script setup lang="ts"></script>
```

如上所示，typeScript会提示找不到`hony-button`组件。

## 2. 问题原因

Vue3并没有对全局注册的组件进行类型声明，导致类型提示报错。

## 3. 解决方案

对组件库的全局注册组件进行类型声明，利用TypeScript模块扩充技术，对全局组件的类型进行扩充，从而实现对新注册全局组件的类型保护

## 4. 实现步骤

### 4.1. 声明一个*.d.ts文件

### 4.2. 对类型进口进行类型模块扩充并导出

## 5. 实现方式

主要有如下三种实现方式：

### 5.1 扩充@vue/runtime-core模块的GlobalComponents接口

在组件库根目录下创建一个`components.d.ts`文件，并在其中定义`GlobalComponents`类型接口，如下：

```typescript
import HonyButton from './components/HonyButton.vue'
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    HonyButton: typeof HonyButton
  }
}
```

推荐使用这种方式，同时也是Volar官方全局组件的推荐写法，基于Volar，必须安装该插件，GlobalComponents是Volar专门为了解决全局组件类型而新增的类型接口

Webstorm自带的语言支持中提供Volar插件，vscode可能需要自行安装Volar插件？

使用pnpm创建的vite项目，在vscode中可能会无法获取类型提示，参考[这里](https://chenkai.life/vue/vue%E5%85%A8%E5%B1%80%E7%BB%84%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%90%E7%A4%BA/#%E4%BD%BF%E7%94%A8pnpm%E5%91%BD%E4%BB%A4%E5%88%9B%E5%BB%BA%E7%9A%84vite%E9%A1%B9%E7%9B%AE%E6%97%A0%E6%B3%95%E5%9C%A8vscode%E4%B8%AD%E8%8E%B7%E5%BE%97%E7%BB%84%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%90%E7%A4%BA)解决

### 5.2 扩充vue模块的GlobalComponents接口

在组件库根目录下创建一个`components.d.ts`文件，并在其中定义`GlobalComponents`类型接口，如下：

```typescript
import HonyButton from './components/HonyButton.vue'
declare module 'vue' {
  export interface GlobalComponents {
    HonyButton: typeof HonyButton
  }
}
```

这是element-plus组件库的实现方式

### 5.3 扩充vue模块的ComponentCustomProperties接口

```typescript
import HonyButton from './components/HonyButton.vue'
declare module 'vue' {
  export interface ComponentCustomProperties {
    honyButton: typeof HonyButton
  }
}
```

这是不推荐的方式，因为ComponentCustomProperties设计用于声明全局属性类型，而不是全局组件类型

## 6. 总结

该问题的解决方式实际上就是对vue预留的全局组件组件或全局属性接口进行扩充，加入我们自定义的组件，从而实现对新注册全局组件的类型保护。

## 7. 参考

- [全局组件类型声明的最佳实践 (Vue3+TS+Volar)](https://juejin.cn/post/7066730414626308103)
- [Vue全局组件类型提示](https://chenkai.life/vue/vue%E5%85%A8%E5%B1%80%E7%BB%84%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%90%E7%A4%BA/#%E4%BD%BF%E7%94%A8pnpm%E5%91%BD%E4%BB%A4%E5%88%9B%E5%BB%BA%E7%9A%84vite%E9%A1%B9%E7%9B%AE%E6%97%A0%E6%B3%95%E5%9C%A8vscode%E4%B8%AD%E8%8E%B7%E5%BE%97%E7%BB%84%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%90%E7%A4%BA)
