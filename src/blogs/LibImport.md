---
title: 组件库的按需导入
date: 2024-10-12
componentName: LibImport
tags:
  - Vue
  - Vite
  - 组件库
  - 按需导入
---

# 组件库的按需导入

[[toc]]

当我们组件库的组件过多时，有时候并不需要导入所有的组件，只需要导入我们需要的组件即可。这就需要对组件库进行改造，使其支持按需导入

## 1 修改打包配置

目前的打包是将所有到的组件打包到一个文件中，我们需要将每个组件单独打包。

之前使用的自动生成类型声明文件的插件vue-tsc，该插件其实与vite的集成不太好，所以我们替换为vite-plugin-dts。

```bash
pnpm add vite-plugin-dts -D
```

配置文件如下：

hony-ui/lib/vite.config.ts

```typescript
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        vue(),
        dts({
            outDir: ["./dist/es", "./dist/cjs"]
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'HonyUI',
            fileName: "hony-ui"
        },
        emptyOutDir: true,
        rollupOptions: {
            external: ['vue'],
            input: ["index.ts"],
            output: [
                {
                    format: 'es',  // ES Module 格式
                    dir: 'dist/es',  // 输出目录
                    preserveModules: true,  // 保持模块独立
                    entryFileNames: '[name].mjs'
                },
                {
                    format: 'cjs',  // CJS 格式
                    dir: 'dist/cjs',  // 输出到 dist/cjs 目录
                    preserveModules: true,  // 保持模块独立
                    entryFileNames: '[name].cjs'  // 指定输出文件名称
                }
            ]
        }
    }
});
```

上述配置中，我们将打包出两个格式的组件库，ES Module 和 CJS 格式。且使用dts插件生成类型声明文件。

运行 `vite build` 命令，打包后的目录结构如下：

``` perl
dist
├── cjs
│   ├── HonyButton.cjs
│   ├── HonyButton.d.ts
│   ├── HonyInput.cjs
│   ├── HonyInput.d.ts
│   ├── HonyHorizontalScroll.cjs
│   ├── HonyHorizontalScroll.d.ts
│   ├── index.cjs
│   └── index.d.ts
├── es
│   ├── HonyButton.mjs
│   ├── HonyButton.d.ts
│   ├── HonyInput.mjs
│   ├── HonyInput.d.ts
│   ├── HonyHorizontalScroll.mjs
│   ├── HonyHorizontalScroll.d.ts
│   ├── index.mjs
│   └── index.d.ts
```

之后，我们需要修改 `package.json` 文件。

```json
{
  "name": "hony-ui",
  "version": "0.0.1",
  "description": "A Vue 3 component library",
  "type": "module",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/es/index.mjs",
  "types": "./dist/es/index.d.ts",
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
    "build": "vite build"
  },
  "peerDependencies": {
    "vue": "^3.5.10"
  },
  "devDependencies": {
    "@types/node": "^22.7.5",
    "@vitejs/plugin-vue": "^5.1.4",
    "sass": "^1.79.5",
    "shelljs": "^0.8.5",
    "typescript": "^5.5.3",
    "vite": "^5.4.8",
    "vite-plugin-vue-devtools": "^7.4.6"
  },
  "dependencies": {
    "vite-plugin-dts": "^4.3.0"
  }
}
```

主要目的是修改 `main`、`module`、`types` 字段，使其指向相应的打包文件。

## 2 手动导入

完成上述配置后，对自建库运行 `vite build` 命令，即可生成组件库的打包文件。

此时，我们已经可以手动进行按需加载了。

hony-ui/app/src/test/HonyButtonTest.vue

```vue

<template>
  <hony-button>Click me</hony-button>
</template>
<script setup lang="ts">

  defineOptions({name: 'HonyButtonTest'})
</script>
<style lang="scss" scoped></style>

```

由于es模块属于静态编译，所以其天然支持tree-shaking，即只打包我们用到的代码。

在打包app前，我们可以安装一个打包分析工具，比如vite-plugin-analyzer，来分析打包。

hony-ui/app

```bash
pnpm add rollup-plugin-visualizer -D
```

然后，在vite.config.ts中配置插件：

```typescript
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools'
import {visualizer} from 'rollup-plugin-visualizer'
import {resolve} from 'path';

export default defineConfig({
    plugins: [vue(), vueDevTools(), visualizer({
        emitFile: false,
        open: true
    })],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, './src')
            }
        ]
    }
});
````

然后，运行 `vite build` 命令，打包完成后，会自动打开浏览器，看到打包分析结果。

## 3 按需全局注册组件

手动导入虽然可以实现按需加载，但手动导入的组件需要在每个组件中进行导入，不方便。

我们可以将使用到的组件在app的入口文件中进行全局注册，这样只需要在模板中使用组件名即可。

首先，我们修改下组件库的组件代码结构，需要给每个组件单独配置入口文件。

hony-ui/lib

```perl
├── HonyButton
│   ├── src
│   │   └── index.vue
│   └── index.ts
├── HonyInput
│   ├── src
│   │   └── index.vue
│   └── index.ts
├── HonyHorizontalScroll
│   ├── src
│   │   └── index.vue
│   └── index.ts

├── index.ts
├── index.ts
├── tsconfig.json
└── vite.config.ts
```

以HonyButton为例，其入口文件如下：

hony-ui/lib/HonyButton/index.ts

```typescript
import HonyButton from './src/index.vue';
import {App} from 'vue'

const install = (app: App): void => {
    app.component(HonyButton.name!, HonyButton);
};

export default {
    install
};
```

我们创建了一个install方法，使用默认导出的形式进行导出， 供vue示例全局注册时调用。

随后，修改组件库的主入口文件，使其兼容全部导入和按需导入两种方式。

hony-ui/lib/index.ts

```typescript
import HonyButton from './components/HonyButton/index.js';
import HonyInput from './components/HonyInput/index.js';
import HonyHorizontalScroll from './components/HonyHorizontalScroll/index.js';
import {App} from 'vue';

const components = [HonyButton, HonyInput, HonyHorizontalScroll];

const install = (app: App) => {
    components.forEach((component) => {
        app.use(component);
    });

    // 创建 link 元素
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './styles/fonts';  // 外链地址

    // 将 link 元素添加到 head
    document.head.appendChild(link);
};

export default {
    install
};

export {
    HonyButton,
    HonyInput,
    HonyHorizontalScroll
};
```

我们采用默认导出install方法实现自建库的全部加载。

同时，我们采用具名导出的方式，向外部暴露了每个组件的入口，实现了按需导入。

将组件库编译打包后，安装至app，我们在app的入口文件main.ts中就可以采用两种方式进行导入：

### 全部导入

```typescript
import HonyUI from 'hony-ui';
import {createApp} from 'vue';
import "hony-ui/dist/es/style.css";

const app = createApp(App);

app.use(HonyUI);

app.mount('#app');
```

### 按需导入

```typescript
import {HonyButton} from 'hony-ui';
import {createApp} from 'vue';
import "hony-ui/dist/es/style.css";

const app = createApp(App);

app.use(HonyButton);

app.mount('#app');
```

通过按需导入的方式，编译app后，打包文件详情如下，可以看到只有HonyButton组件被打包进来了。

<img src="/images/blogs/importNeededAlalyze-1.png" alt="按需导入分析图" width="100%">

PS：在lib中使用pnpm pack然后在app中安装的过程中踩了一个坑，发现app使用的始终不是最新的hony-ui依赖。分析原因可能是pnpm
pack前没有修改lib的package.json中的version，导致app安装的始终是旧版本的hony-ui。解决方法是先修改lib的package.json中的version，然后再pnpm
pack，再安装到app。

## 4 自动按需导入

尽管我们已经可以通过全局按需注册组件的方式来进行按需导入组件了，但往往还是会嫌麻烦——每使用一个组件库组件，就要在main.ts中注册一下，有没有自动注册的方法呢？

答案是有的，那就是使用 `unplugin-vue-components` 和 `unplugin-auto-import` 这两款插件。这也是Element Plus按需加载使用的方案。

### unplugin-vue-components

`unplugin-vue-components` 旨在自动导入 Vue 组件，无需手动在每个文件中引入。它的原理是通过解析项目中的 Vue
文件，分析使用到的组件标签（例如 `<el-button>` ），并自动引入相应的组件。

比如以下代码：

```vue
<template>
  <div>
    <el-button>Click Me</el-button>
  </div>
</template>

<script>
  export default {
    name: 'MyComponent'
  }
</script>
```

插件会使用AST分析出 `<el-button>` 标签，将其与配置的组件库（如 `Element Plus`
）进行匹配。如果找到对应的组件，插件就知道该标签是 `Element Plus` 提供的 `ElButton` 组件。

一旦匹配到组件，插件会在脚本部分插入相应的导入语句。在此例中，插件会自动添加以下导入：

```typescript
import {ElButton} from 'element-plus';
```

这样，无需手动在每个文件中导入 `Element Plus` 的组件，只需在模板中使用 `<el-button>` 标签即可。

### unplugin-auto-import

`unplugin-auto-import` 用于自动导入工具函数、钩子（如 Vue 的 ref、computed、watch），省去手动导入的繁琐步骤。

比如以下代码：

```typescript
const count = ref(0);
const double = computed(() => count.value * 2);
```

插件会自动分析出 `ref`、`computed` 这两个函数，并自动导入 `vue` 库。

插件会在代码开头自动插入以下导入语句：

```typescript
import { ref, computed } from 'vue';
```

最终的代码在编译时会自动变成如下内容：

```typescript
import { ref, computed } from 'vue';

const count = ref(0);
const double = computed(() => count.value * 2);
```

这样，无需手动导入 `vue` 库，只需在代码中使用 `ref`、`computed` 这两个函数即可。

可以发现，使用插件进行自动按需加载，并没有使用组件全局注册的方式，而是自动在需要的地方进行导入。

### 配置插件

首先，我们安装插件：

```bash
pnpm add unplugin-vue-components unplugin-auto-import -D
```

然后，在 `vite.config.ts` 中配置插件：

home-ui/app/vite.config.ts
```typescript
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools'
import {visualizer} from 'rollup-plugin-visualizer'
import {resolve} from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {HonyUIResolver} from 'hony-ui'

export default defineConfig({
    plugins: [vue(), vueDevTools(), visualizer({
        emitFile: false,
        open: true
    }),
        AutoImport({
            imports: [
                "vue"
            ],
            dts: "./auto-imports.d.ts"
        }),
        Components({
            resolvers: [HonyUIResolver()],
            dts: "./components.d.ts"
        })],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, './src')
            }
        ]
    }
});
```

如上，我们配置了 `HonyUIResolver` 作为组件库的解析器，这样插件就可以自动识别到 `HonyUI` 组件库的组件。同时，还顺便配置了vue库函数的自动导入。

`HonyUIResolver`是自定义的解析器，它继承自 `ComponentResolver`，并重写了 `resolve` 方法，使其可以识别到 `HonyUI` 组件库的组件。

hony-ui/lib/utils/HonyUIResolver.ts
```typescript
import {
  ComponentResolver,
  ComponentResolveResult,
} from "unplugin-vue-components";

const toPascalCase = (kebabCaseName: string) =>
  kebabCaseName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());

const toCamelCase = (name: string) => {
  // 如果是 kebab-case 格式 (带有短横线的命名)
  if (name.includes("-")) {
    return name
      .replace(/-(\w)/g, (_, letter) => letter.toUpperCase()) // 将短横线后的字母转换为大写
      .replace(/^\w/, (firstLetter) => firstLetter.toLowerCase()); // 将第一个字母转换为小写
  }

  // 如果是 PascalCase 格式 (大驼峰命名)
  if (/^[A-Z]/.test(name)) {
    return name.replace(/^[A-Z]/, (firstLetter) => firstLetter.toLowerCase()); // 将第一个字母变为小写
  }

  // 否则，直接返回原始字符串
  return name;
};

export const HonyUIResolver = (): ComponentResolver => ({
  type: "component",
  resolve: (name: string): ComponentResolveResult => {
    let ComponentName = name;
    // 处理以 Hony 开头的组件，例如 HonyButton -> hony-button
    if (name.startsWith("hony-")) {
      ComponentName = toPascalCase(name);
      return {
        name: ComponentName,
        from: `hony-ui`,
      };
    }
    if (name.startsWith("Hony")) {
      return {
        name: ComponentName,
        from: `hony-ui`,
      };
    }
    return null;
  },
});
```

### 实现效果

通过上述配置，我们即可实现自动按需导入组件库的组件了。

```vue
<template>
    <hony-button>Click me</hony-button>
</template>
<script setup lang="ts">
defineOptions({name: 'HonyButtonTest'})
</script>
<style lang="scss" scoped></style>
```

我们在main中删去全局注册HonyButton组件的代码，然后执行 `vite build` 命令，可以看到目录中多出了 `auto-imports.d.ts` 和 `components.d.ts` 文件，这两个文件是插件自动生成的类型文件，用于提供代码提示和类型检查。

hony-ui/app/components.d.ts
```typescript
/* eslint-disable */
// @ts-nocheck
// Generated by unplugin-vue-components
// Read more: https://github.com/vuejs/core/pull/3399
export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    HonyButton: typeof import('hony-ui')['HonyButton']
  }
}
```

`components.d.ts` 文件中，我们可以看到 `HonyButton` 组件的声明，它是 `HonyUI` 组件库的 `HonyButton` 组件。

综上，我们组件库的自动导入也实现了。

-------

但是，有个地方大家有没有发现，我刻意的没有将组件库的样式导入进来。

`import "hony-ui/dist/es/style.css";` 这行代码会将组件库的所有样式都导入进来，虽然可以解决样式丢失问题，但是我们不需要的组件样式也会进行导入。

因此，我们需要对组件库的样式也进行按需导入，只导入我们需要的样式。

那如何判断哪些样式是我们需要的呢？

这就要涉及到对组件样式结构的设计了。

我们将在下一篇文章中详细介绍组件库样式的按需导入。





