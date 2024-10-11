---
title: Vue3组件库本地调试最佳实践
date: 2024-10-11
componentName: LibDev
tags:
  - Vue
  - Vite
  - 组件库
---

# Vue3组件库本地调试最佳实践

[[toc]]

## 1 背景

在开发 Vue 组件库时，我们需要本地调试组件，以便于开发者在开发过程中可以及时看到组件的效果。

以下是几种常见的方式：

### 1.1 使用npm/pnpm的link命令

使用npm/pnpm的link命令将组件库链接到项目中，这样就可以在项目中调试本地的组件库。

```bash
# 1. 编译组件库
pnpm run build

# 2. 创建链接
pnpm link

# 3. 链接到项目
cd my-project
pnpm link hony-ui
```

缺点：每次更新组件库代码后，都需要手动编译自建库，不方便开发者调试。

### 1.2 使用npm/pnpm的pack命令

使用npm/pnpm的pack命令将组件库打包成tar包，然后将tar包安装到项目中。

```bash
# 1. 编译组件库
pnpm run build

# 2. 打包组件库
pnpm pack

# 3. 安装组件库
cd my-project
pnpm install path/to/hony-ui-1.0.0.tgz
```

缺点：与link命令缺点相同，每次更新组件库代码后，都需要手动编译、打包组件库，再安装到项目中。

### 1.3 使用第三方工具yark等

将组件库代码编译后，使用第三方工具yark等将编译后的代码进行虚拟发布，然后在项目中安装虚拟包。

这种方式最能模拟真实环境，但对于本地调试来说，不是很合适。

### 1.4 使用pnpm的workspaces

2021年10月，pnpm 6.20.0版本引入了workspaces功能，可以将多个项目组成一个工作空间，方便开发者在一个项目中调试多个组件库。

如下，在项目根目录下，创建pnpm-workspace.yaml文件，并配置工作空间：

```yaml
packages:
  - 'app/*'
  - 'lib/*'
```

app和lib目录分别存放调试项目和组件库，然后在项目中安装依赖：

app的package.json直接引入本地组件库：

```json
{
  "dependencies": {
    "hony-ui": "workspace:*"
  }
}
```

这样，就可以在app项目中调试本地的组件库。

缺点：每次修改代码后，是否能够及时看到效果，取决于lib的package.json中入口文件的配置。

比如，如果lib的package.json中，main字段指向了lib/index.js，那么修改代码后，在app中可以实时看到效果；如果main字段指向了lib/dist/hony-ui.umd.js，那么修改代码后，需要重新编译lib，再app中才能看到效果。

同时，由于组件库发版，main字段需要指向lib/dist/hony-ui.umd.js，那么在每次编译时，还需要手动或使用脚本修改main字段

## 2 最佳实践

为了更方便的本地调试组件库，及时看到组件库代码修改后的效果，我们可以采用路径别名的方式

### 2.1 路径别名

webpack和viter都支持路径别名，可以将路径中的某些部分替换成别名。以vite为例，路径别名的配置如下：

```typescript
// vite.config.ts
import {defineConfig} from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'hony-ui': path.resolve(__dirname, './lib/index.ts')
        }
    }
})
```

这样，在项目中，可以直接使用别名来进行导入：

```typescript
import App from '@/App.vue' // 等同于 import App from './src/App.vue'
import {Button} from 'hony-ui' // 等同于 import { Button } from './lib/index.ts'
```

如果使用ts，还需要配置tsconfig.json文件，将路径别名加入到编译路径中：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": [
        "src/*"
      ],
      "hony-ui": [
        "lib/index.ts"
      ]
    }
  }
}
```

这样，就能获得ts的类型提示

### 2.2 修改项目结构

我们修改项目的结构，在项目根目录下创建app和lib目录，分别存放调试项目和组件库。结构如下：

```perl
├── hony-ui/                  # 项目根目录
│   ├── app/                  # 调试项目目录
│   │   ├── src/              
│   │   │   ├── test/
│   │   │   │   ├── HonyButtonTest.vue
│   │   │   │   └── HonyInputTest.vue
│   │   │   ├── App.vue       
│   │   │   └── main.ts       
│   │   ├── index.html        
│   │   ├── package.json      
│   │   ├── tsconfig.json     
│   │   └── vite.config.ts    
│   ├── lib/                  # 组件库目录
│   │   ├── components/
│   │   │   ├── HonyButton.vue
│   │   │   └── HonyInput.vue
│   │   ├── components.d.ts    
│   │   ├── index.ts          
│   │   ├── package.json      
│   │   ├── tsconfig.json      
│   │   └── vite.config.ts    
│   ├── package.json          # 项目配置文件 
│   ├── pnpm-lock.yaml        # 依赖锁文件
│   ├── pnpm-workspace.yaml   # 工作空间配置文件 
│   └── tsconfig.json         # TypeScript 配置文件 
```

### 2.3 hony-ui/pnpm-workspace.yaml

```yaml
packages:
  - 'app'
  - 'lib'
```

### 2.4 hony-ui/package.json

```json
{
  "name": "root"
}
```

### 2.5 hony-ui/tsconfig.json

```json
{
  "compilerOptions": {
    // 设定编译的 JavaScript 版本,
    "target": "ESNext",
    // 使用 ESNext 模块系统,
    "module": "ESNext",
    // 模块解析策略,
    "moduleResolution": "Node",
    // 启用所有严格类型检查选项,
    "strict": true,
    // 允许 CommonJS 和 ES 模块之间的互操作性,
    "esModuleInterop": true,
    // 跳过库文件的类型检查,
    "skipLibCheck": true,
    // 强制文件名一致的大小写,
    "forceConsistentCasingInFileNames": true,
    // 允许引入 JSON 模块,
    "resolveJsonModule": true,
  }
}
```

### 2.6 hony-ui/app/package.json

```json
{
  "name": "hony-ui-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.5.10"
  },
  "devDependencies": {
    "@types/node": "^22.7.5",
    "@vitejs/plugin-vue": "^5.1.4",
    "typescript": "^5.5.3",
    "vite": "^5.4.8",
    "vite-plugin-vue-devtools": "^7.4.6",
    "vue-tsc": "^2.1.6"
  }
}
```

### 2.7 hony-ui/app/vite.config.ts

```typescript
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools'
import {resolve} from 'path';

export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src") , // 使用 __dirname 拼接 src 目录路径
            "hony-ui": resolve(__dirname, "../lib/index.ts")
        }
    }
});
```

如上，配置路径别名，将项目根目录下的 src 目录映射到 app/src 目录，将 lib 目录下的 index.ts 映射到 lib/index.ts，即组件库入口。

### 2.8 hony-ui/app/tsconfig.json

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "jsx": "preserve",
    "types": ["vite/client"],
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "hony-ui": ["../lib/index.ts"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

继承了项目根目录下的 tsconfig.json 文件，并配置路径别名。

### 2.9 hony-ui/app/src/main.ts

```typescript
import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)

app.mount('#app')
```

此处可以使用全局注册的方式来使用组件库，但是会缺少类型提示。因此，我们不在此做全局注册。

### 2.10 hony-ui/app/src/App.vue

```html
<template>
    <div id="app">
        <hony-button-test/>
        <hony-input-test/>
    </div>
</template>

<script setup lang="ts">

import HonyButtonTest from '@/test/HonyButtonTest.vue'
</script>

<style>
/* 全局样式 */
html, body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

#app {
    height: 100%;
    width: 100%;
    display: flex;
}

* {
    box-sizing: border-box; /* 确保所有元素的宽高包含内边距和边框 */
}
</style>
```

### 2.11 hony-ui/app/src/test/

HonButtonTest.vue
```html
<template>
    <hony-button>Click me</hony-button>
</template>
<script setup lang="ts">
import {HonyButton} from 'hony-ui'

defineOptions({name: 'HonyButtonTest'})
</script>
<style lang="scss" scoped></style>
```

HonInputTest.vue
```html

<template>
    <hony-input></hony-input>
</template>
<script setup lang="ts">
    import {HonyInput} from 'hony-ui'

    defineOptions({name: 'HonyInputTest'})
</script>
<style lang="scss" scoped></style>
```

如上，采用具名导入的方式，导入组件库中的组件并进行调试。

### 2.12 hony-ui/lib/package.json

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
    "build": "vite build && vue-tsc --declaration --emitDeclarationOnly"
  },
  "peerDependencies": {
    "vue": "^3.5.10"
  },
  "devDependencies": {
    "@types/node": "^22.7.5",
    "@vitejs/plugin-vue": "^5.1.4",
    "typescript": "^5.5.3",
    "vite": "^5.4.8",
    "vite-plugin-vue-devtools": "^7.4.6",
    "vue-tsc": "^2.1.6"
  }
}
```

### 2.13 hony-ui/lib/vite.config.ts

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
        outDir: 'dist',
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

### 2.14 hony-ui/lib/tsconfig.json

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationDir": "./dist/types",
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

### 2.15 hony-ui/lib/index.ts

```typescript
import HonyButton from './components/HonyButton.vue';
import HonyInput from './components/HonyInput.vue';
import { App } from 'vue';

const components = [HonyButton, HonyInput];

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

export {
    HonyButton,
    HonyInput,
}
```

为支持能够使用具名导入的方式导入组件，我们需要具名导出组件。

通过以上方式，我们便可以方便的在项目中调试组件库。
