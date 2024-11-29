---
title: 组件库的样式导入
date: 2024-11-29
componentName: StyleImport
tags:
  - Vue
  - Vite
  - 组件库
  - scss
  - css
---

# 组件库的样式导入

[[toc]]

本篇文章将探索组件库的样式导入。

## vite打包的组件库样式导入

vite在打包时，默认会将vue组件中 `<style>` 标签里的样式提取，汇总到根目录下的`style.css`文件中（如果有scss，则会先编译成css）。

这种打包方式优点，是对于库的开发者来说，不需要做额外的配置，只需要在vue组件中写好样式。

但是缺点也很明显：

- 样式不能按需导入，只能导入整个库的样式。
- vite只能打包使用到的样式，如果是声明的一些样式变量，可能不会被打包进来。

## 样式导入最佳实践

本次实践目标如下：

- 按需导入样式，只导入使用到的样式。
- 自动导入样式文件，无需手动导入。
- 提供黑白主题并可以动态切换。
- 用户可以根据组件库样式自定义主题。

### 按需导入样式

使用gulp, gulp-sass将样式文件单独编译并放置到`hony-ui/styles`目录下，然后在组件库的入口文件中，通过`import`导入样式文件。

在`hony-ui/packages`目录中，新建`styles`文件夹，用于存放样式源文件。

编写样式示例文件如下：

1. `hony-ui/packages/styles/hony-button.scss`

```scss
.hony-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
```

2. `hony-ui/packages/styles/base.scss`

```scss
.light-theme {
  --hony-button-bg-color: #007bff;
  --hony-button-text-color: #fff;
}
```

3. `hony-ui/packages/styles/index.scss`

```scss
@use 'base';
@use 'hony-button';
```

在`hony-ui/build/gulpfile.ts`中，编写gulp任务，将样式文件编译成css文件，并放置到`hony-ui/dist/styles`目录下。

```typescript
import {src, dest} from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import {fileURLToPath} from 'node:url';

const sass = gulpSass(dartSass);

const buildStyles = () => {
    return src(
        fileURLToPath(new URL('../packages/styles/*.scss', import.meta.url))
    )
        .pipe(sass.sync().on('error', sass.logError)) // Add error logging here
        .pipe(
            dest(fileURLToPath(new URL('../dist/styles', import.meta.url)))
        );
}
```

以上，便可以实现样式的按需导入。

我们在项目中使用时，只需要在组件中导入样式文件即可：

```typescript
// 按需导入样式
import 'hony-ui/dist/styles/base.css'
import 'hony-ui/dist/styles/hony-button.css';

// 或者全部导入样式
import 'hony-ui/dist/styles/index.css';
```

### 自动导入样式文件

有时候，我们导入一个组件时，可能会同时导入多个样式文件，比如：

```typescript
import 'hony-ui/dist/styles/base.css'
import 'hony-ui/dist/styles/hony-button.css';
```

这种情况下，由用户判断需要导入哪些样式文件，并手动导入的方式显得沉重且繁琐。

我们在实现自动导入前，可以现将某个组件需要导入的样式进行整理，提供一个统一的入口文件，比如：

hony-ui/packages/components/hony-button/style/index.ts

```typescript
import '@hony-ui/styles/src/base.scss';
import '@hony-ui/styles/src/hony-button.scss';
```

该入口文件导入的是scss文件，我们在开发阶段为了方便调试，可以在tsconfig.json中配置别名来指向scss文件，比如：

```json
{
  "compilerOptions": {
    "paths": {
      "@hony-ui/styles/src/*": [
        "./styles/*"
      ]
    }
  }
}
```

同时，我们提供项目的css入口文件：
hony-ui/packages/components/hony-button/style/css.ts

```typescript
import '@hony-ui/styles/base.css';
import '@hony-ui/styles/hony-button.css';
```

然后，我们在使用rollup时，打包替换掉css.ts文件导入路径中的别名。

hony-ui/build/src/tasks/rollup-full.ts

```typescript
import vue from '@vitejs/plugin-vue';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import {fileURLToPath} from 'node:url';
import {rollup} from 'rollup';
import {HonyUIAlias} from '../plugins/hony-ui-alias';

export const buildFull = async () => {
    try {
        const inputOptions = {
            input: fileURLToPath(
                new URL('../../../packages/index.ts', import.meta.url)
            ),
            plugins: [
                HonyUIAlias(),
                vue(),
                nodeResolve({
                    extensions: ['.mjs', '.js', '.ts'],
                }),
                commonjs(),
                esbuild({
                    sourceMap: true,
                    target: 'esnext',
                    loaders: {
                        '.vue': 'ts',
                    },
                }),
                json(),
            ],
            external: (id: string) => /node_modules/.test(id) || id === 'vue',
        };

        const bundle = await rollup(inputOptions);

        await bundle.write({
            file: fileURLToPath(
                new URL('../../../dist/dist/index.umd.js', import.meta.url)
            ),
            name: 'HonyUI',
            format: 'umd',
            exports: 'named',
            sourcemap: true,
            globals: {
                vue: 'Vue',
            },
        });
        console.log('全量构建成功');
    } catch (error) {
        console.error('全量构建失败', error);
        throw error;
    }
};
```

我们实现了一个插件`HonyUIAlias`, 在rollup打包时，替换掉样式入口文件中的路径别名。
hony-ui/build/src/plugins/hony-ui-alias.ts

```typescript
import type {Plugin} from 'rollup';

const PKG_PREFIX = '@hony-ui';
const PKG_NAME = 'hony-ui';

export function HonyUIAlias(): Plugin {
    return {
        name: 'hony-ui-alias-plugin',
        resolveId(id) {
            if (!id.startsWith(PKG_PREFIX)) return;
            return {
                id: id.replaceAll(PKG_PREFIX, PKG_NAME),
                external: 'absolute',
            };
        },
    };
}

```

至于类型声明文件，我们借助gulp-replace直接进行替换即可。

hony-ui/build/gulpfile.ts

```typescript
gulp.task('replace-types', () => {
    return gulp
        .src(['../dist/**/*.d.ts'])
        .pipe(
            replace(
                new RegExp('@hony-ui/styles', 'g'),
                'hony-ui/styles'
            )
        );
});
```

我们在手动导入样式文件时，即可这样写;

```typescript
import 'hony-ui/es/components/hony-button/styles/css.ts'
```

然后，我们扩展`HonyUIResolver`插件，使其在自动导入组件时，也自动导入样式文件。
hony-ui/packags/utils/hony-ui-resolver.ts

```typescript
import type {
    ComponentResolver,
    ComponentResolveResult,
} from 'unplugin-vue-components';

// 将 kebab-case 格式的字符串转换为 PascalCase 格式
const toPascalCase = (kebabCaseName: string) =>
    kebabCaseName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());

// 将 kebab-case 格式的字符串转换为 camelCase 格式，如果不是则直接返回原字符串
const toCamelCaseIfKebabCase = (name: string) => {
    // 如果是 kebab-case 格式 (带有短横线的命名)
    if (name.includes('-')) {
        return name
            .replace(/-(\w)/g, (_, letter) => letter.toUpperCase()) // 将短横线后的字母转换为大写
            .replace(/^\w/, firstLetter => firstLetter.toLowerCase()); // 将第一个字母转换为小写
    }

    // 如果是 PascalCase 格式 (大驼峰命名)
    if (/^[A-Z]/.test(name)) {
        return name.replace(/^[A-Z]/, firstLetter => firstLetter.toLowerCase()); // 将第一个字母变为小写
    }

    // 否则，直接返回原始字符串
    return name;
};

// 将 PascalCase 格式的字符串转换为 kebab-case 格式，如果不是则直接返回原字符串
const toKebabCaseIfPascalCase = (name: string) => {
    // 判断是否为 PascalCase 格式（以大写字母开头）
    if (/^[A-Z]/.test(name)) {
        return name
            .replace(/([a-z])([A-Z])/g, '$1-$2') // 小写字母后紧跟大写字母时加短横线
            .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // 连续大写后接小写时加短横线
            .toLowerCase(); // 转为小写
    }

    // 如果不是 PascalCase，直接返回原字符串
    return name;
};

// HonyUIResolver 函数，用于解析 Hony 组件
export const HonyUIResolver = (): ComponentResolver => ({
    type: 'component',
    resolve: (name: string): ComponentResolveResult | null => {
        let ComponentName = name;
        // 处理以 Hony 开头的组件，例如 HonyButton -> hony-button
        if (name.startsWith('hony-')) {
            ComponentName = toPascalCase(name);
            return {
                name: ComponentName,
                from: `hony-ui`,
                sideEffects: `hony-ui/es/components/${name}/style/css.ts`,
            };
        }
        if (name.startsWith('Hony')) {
            return {
                name: ComponentName,
                from: `hony-ui`,
                sideEffects: `hony-ui/es/components/${toKebabCaseIfPascalCase(name)}/style/css.ts`,
            };
        }
        return null;
    },
});
```

在项目中使用自动导入前，我们需要在`vite.config.ts`中配置`unplugin-vue-components`插件，并传入`HonyUIResolver`函数。

```typescript
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import {HonyUIResolver} from 'hony-ui';

export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [HonyUIResolver()],
        }),
    ],
});
```

至此，我们便可以实现组件和相关样式的完全自动导入。

### 提供黑白主题并可以动态切换

我们可以使用css变量和属性选择器，实现黑白主题的切换。

假设我们有如下样式文件：

```scss
.hony-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: var(--hony-button-bg-color, #007bff);
  color: var(--hony-button-text-color, #fff);
  cursor: pointer;
}
```

我们可以为变量`--hony-button-bg-color`和`--hony-button-text-color`设置不同主题下的值。

```scss
:root {
  --hony-button-bg-color: #007bff;
  --hony-button-text-color: #fff;
}

.dark-theme {
  --hony-button-bg-color: #343a40;
  --hony-button-text-color: #fff;
}
```

正常情况下，我们使用默认的主题。当我们需要切换到黑白主题时，我们在html标签中添加`class="dark-theme"`，样式便会切换到黑白主题。

建议使用 useDark | VueUse进行主题的动态切换。

### 用户可以根据组件库样式自定义主题

使用scss定义变量，然后通过sass函数将scss变量转为css变量，并进行导出。

这样，用户可以通过引入scss变量文件并进行变量覆盖，然后重新编译css文件。

也可以通过css变量覆盖的方式，来自定义组件库的主题。




