---
title: 使用 Vue 3 和 Vite 从 0 到 1 搭建组件库
date: 2024-10-10
componentName: CreateUILib
tags:
  - Vue
  - Vite
  - 组件库
---

# 使用 Vue 3 和 Vite 从 0 到 1 搭建组件库

本篇文章将探索如何使用 Vue 3 和 Vite 从 0 到 1 搭建一个组件库。

[[toc]]

## 技术概览

在构建这个组件库的过程中，用到的技术和版本如下：

- **Node.js**：18.20.4。
- **pnpm**：9.11.0。
- **Vue**：3.5.10。
- **Vite**：5.4.8。
- **TypeScript**：5.5.3。

---

## 1. 初始化项目

在终端中执行以下命令：

```bash
pnpm create vite
```

根据提示，输入项目名称、选择Vue和TypeScript，完成项目创建

```bash
PS C:\Users\19465\Desktop\code> pnpm create vite
√ Project name: ... hony-ui
√ Select a framework: » Vue
√ Select a variant: » TypeScript
```

进入项目，安装依赖：

```bash
cd hony-ui
pnpm install
```

## 2 调整项目结构

调整项目结构如下：

```bash
├── hony-ui/                  # 项目根目录
│   ├── components/       # 组件目录
│   │   ├── MyButton.vue  # 示例组件
│   │   └── MyInput.vue   # 示例组件
│   ├── index.ts          # 组件库入口文件
│   ├── package.json          # 项目配置文件
│   ├── pnpm-lock.yaml        # 依赖锁文件
│   ├── vite.config.ts        # Vite 配置文件
│   └── tsconfig.json         # TypeScript 配置文件
```

## 3 编写tsconfig.json文件 

编辑 tsconfig.json 文件，确保路径别名、编译选项和严格性检查符合项目需求。

```json
{
  "compilerOptions": {
    // 确保生成类型声明文件
    "declaration": true,
    "emitDeclarationOnly": true,
    // 指定类型声明文件的输出目录
    "declarationDir": "./dist/types",
    "target": "ESNext",
    // 设定编译的 JavaScript 版本
    "module": "ESNext",
    // 使用 ESNext 模块系统
    "moduleResolution": "Node",
    // 模块解析策略
    "strict": true,
    // 启用所有严格类型检查选项
    "jsx": "preserve",
    // JSX 保留用于 Vue 文件
    "esModuleInterop": true,
    // 允许 CommonJS 和 ES 模块之间的互操作性
    "skipLibCheck": true,
    // 跳过库文件的类型检查
    "forceConsistentCasingInFileNames": true,
    // 强制文件名一致的大小写
    "resolveJsonModule": true,
    // 允许引入 JSON 模块
    "baseUrl": "./",
  },
  "include": [
    "**/*.ts",
    "**/*.d.ts",
    "**/*.tsx",
    "**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## 4 编写vite.config.ts文件

```typescript
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'HonyUI',
            fileName: (format) => `hony-ui.${format}.js`
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
});
```

注意： `import {resolve} from 'path';`会出现错误，需要安装`@types/node`依赖。

```bash
pnpm install @types/node -D
```

## 5 package.json文件内容如下：

```json
{
  "name": "hony-ui",
  "version": "0.0.1",
  "description": "A Vue 3 component library",
  "main": "dist/hony-ui.umd.js",
  "module": "dist/hony-ui.es.js",
  "types": "dist/types/index.d.ts",
  "files": [
    "dist"
  ],
  "keywords": [
    "vue",
    "vue3",
    "component",
    "library"
  ],
  "scripts": {
    "build": "vite build && vue-tsc --declaration --emitDeclarationOnly",
    "serve": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.10"
  },
  "devDependencies": {
    "@types/node": "^22.7.5",
    "@vitejs/plugin-vue": "^5.1.4",
    "typescript": "^5.5.3",
    "vite": "^5.4.8",
    "vue-tsc": "^2.1.6"
  }
}

```

## 6 编写组件库入口文件

在组件库根目录下创建 index.ts 文件，内容如下：

```typescript
import MyButton from './components/MyButton.vue';
import MyInput from './components/MyInput.vue';
import { App } from 'vue';

const components = [MyButton, MyInput];

const install = (app: App) => {
    components.forEach((component) => {
        if (!component.name) {
            console.warn(`Component name is undefined for ${component.component}`);
        } else {
            app.component(component.name, component);
        }
    });
};

const HonyUI = {
    install,
};

export default HonyUI;
```

## 7 编写示例组件

在 components 目录下创建 MyButton.vue 和 MyInput.vue 文件，内容如下：

MyButton.vue
```html
<template>
    <button class="my-button">{{ text }}</button>
</template>
<script setup lang="ts">
    import { ref } from 'vue'

    defineOptions({name: 'MyButton'})
    const text = ref('Click me')
</script>
<style scoped>
    .my-button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
    }
</style>
```

MyInput.vue
```html
<template>
    <div>
        <label for="my-input">{{ label }}</label>
        <input type="text" id="my-input" v-model="value">
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue'
    defineOptions({name: 'MyInput'})

    const label = ref('My Input')
    const value = ref('')
</script>
```

## 8 编译组件库

在终端中执行以下命令：

```bash
pnpm build
```

## 9 发布组件库
发布组件库前，需要先在 npm 账户中注册账号，并登录。

```bash
npm login
```

注意：每次发布组件库时，需要更新 package.json 文件的版本号。

发布组件库到 npm 仓库，执行以下命令：

```bash
pnpm publish
```

## 10 使用组件库

在项目中使用组件库，需要先安装依赖：

```bash
pnpm install hony-ui
```

在项目中使用组件库，需要在 main.ts 文件中导入组件库：

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import HonyUI from 'hony-ui';

const app = createApp(App);
app.use(HonyUI);
app.mount('#app');
```

在 App.vue 文件中使用组件：

```html
<template>
  <div id="app">
    <hony-button>Hello World</hony-button>
    <hony-input></hony-input>
  </div>
</template>

<script setup lang="ts">
</script>
```

