---
title: 自定义打包
date: 2024-11-20
componentName: GulpBuild
tags:
  - gulp
  - build
  - 组件库
---

# 自定义打包

[[toc]]

目前组件库使用的vite打包方式，不能满足一些特定的需求，比如每次打包时修改package.json中的版本等，以及后续对样式进行按需加载。

因此，本篇文章使用rollup作为基础打包工具，结合gulp对打包流程进行编排。

## 使用rollup完成基础打包

vite的底层实际上是使用rollup进行打包的，因此我们可以直接使用rollup进行打包。

我们在项目的根目录下创建一个 `build` 子项目，专门用于组件库的打包。

子项目的目录结构如下：

``` perl
hony-ui
└── build
    ├── src
    │   ├── tasks
    │   │   ├── rollup-full.ts
    │   │   └── rollup-modules.ts
    │   └── build-infos.ts
    ├── gulpfile.ts
    ├── package.json
    └── build-infos.ts
```

其中 `src` 目录下存放着打包相关的脚本，`tasks` 目录下存放着两个打包脚本，`rollup-full.ts` 用于完整打包，`rollup-modules.ts`
用于按需打包。

`build-infos.ts` 用于存放打包相关的信息，比如版本号、打包路径等。

`gulpfile.ts` 用于编排打包流程。

### 完整打包

我们首先完成组件库的完整打包，借助于rollup提供了各种api接口，方便我们通过实现接口的方式来进行打包。

首先，我们需要安装rollup相关依赖：

hony-ui/build

``` bash
pnpm add -D rollup @types/rollup @rollup/plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-typescript rollup-plugin-esbuild
```

然后，我们在 `tasks/rollup-full.ts` 中编写完整打包脚本：

hony-ui/build/src/tasks/rollup-full.ts

``` ts
import vue from '@vitejs/plugin-vue'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import {fileURLToPath} from 'node:url'
import {rollup} from 'rollup'

export const buildFull = async () => {
    try {
        const inputOptions = {
            input: fileURLToPath(new URL('../../../packages/index.ts', import.meta.url)),
            plugins: [
                vue(),
                nodeResolve({
                    extensions: ['.mjs', '.js', '.ts']
                }),
                commonjs(),
                esbuild({
                    sourceMap: true,
                    target: 'esnext',
                    loaders: {
                        '.vue': 'ts'
                    }
                }),
                json()
            ],
            external: (id: string) => /node_modules/.test(id) || id === 'vue'
        }

        const bundle = await rollup(inputOptions)

        await bundle.write({
            file: fileURLToPath(new URL('../../../dist/dist/index.umd.js', import.meta.url)),
            name: 'HonyUI',
            format: 'umd',
            exports: 'named',
            sourcemap: true,
            globals: {
                vue: 'Vue'
            }
        })
        console.log("全量构建成功")
    } catch (error) {
        console.error("全量构建失败", error)
        throw error
    }
}
```

这里，我们使用 `rollup` 接口，通过 `inputOptions` 配置打包入口文件、插件等信息，通过 `bundle.write` 接口，输出打包结果。

其中，`external` 配置项用于排除依赖包，比如 `vue` 等。

然后，我们在 `gulpfile.ts` 中调用 `buildFull` 方法。

首先，我们需要安装 gulp 相关依赖：

hony-ui/build

``` bash
pnpm add -D gulp @esbuild-kit/cjs-loader
```

hony-ui/build/gulpfile.ts

``` ts

import {dest, parallel, series, src, task} from 'gulp';
import {buildFull} from '@hony-ui/build/src/tasks/rollup-full';

task('default', series(buildFull));

然后，我们在 `package.json` 中添加 `build` 命令，由于gulp本身不支持typescript，因此我们需要使用 `@esbuild-kit/cjs-loader` 来加载 gulpfile.ts。

hony-ui/build/package.json
``` json
{
  "name": "build",
  "version": "1.0.0",
  "description": "Build package for the project",
  "type": "module",
  "scripts": {
    "build": "gulp --require node_modules/@esbuild-kit/cjs-loader"
  },
  "devDependencies": {
    "@esbuild-kit/cjs-loader": "^2.4.4",
    "@rollup/plugin-commonjs": "^28.0.1",
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-node-resolve": "^15.3.0",
    "@rollup/plugin-typescript": "^12.1.1",
    "@types/gulp": "^4.0.17",
    "gulp": "^5.0.0",
    "rollup": "^4.24.3",
    "rollup-plugin-esbuild": "^6.1.1"
  }
}
```

最后，我们在build目录下运行 `pnpm build`，即可完成组件库的完整打包。

打包的目录结构如下：

``` perl
hony-ui
└── dist
    └── dist
        └── index.umd.ts
```

### 多入口打包

接下来，我们完成组件库的多入口打包，以便支持按需加载。我们在 `tasks/rollup-modules.ts` 中编写按需打包脚本：

hony-ui/build/src/tasks/rollup-modules.ts

``` ts
import {rollup} from 'rollup'
import vue from '@vitejs/plugin-vue'
import {getFiles} from '@hony-ui/build/src/build-infos'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import {fileURLToPath} from 'node:url'

export const buildModules = async () => {
    try {
        const input = await getFiles()
        const inputOptions = {
            input,
            plugins: [
                vue({
                    isProduction: true
                }),
                nodeResolve({
                    extensions: ['.mjs', '.js', '.ts', '.json']
                }),
                commonjs(),
                esbuild({
                    sourceMap: true,
                    target: 'esnext',
                    loaders: {
                        '.vue': 'ts'
                    }
                }),
                json()
            ],
            external: (id: string) => /node_modules/.test(id) || id === 'vue'
        }

        const bundle = await rollup(inputOptions)

        const esmPromise = bundle.write({
            format: 'esm',
            dir: fileURLToPath(new URL('../../../dist/es', import.meta.url)),
            preserveModules: true,
            preserveModulesRoot: fileURLToPath(new URL('../../../packages', import.meta.url)),
            sourcemap: true,
            entryFileNames: `[name].mjs`
        })

        const cjsPromise = bundle.write({
            format: 'cjs',
            dir: fileURLToPath(new URL('../../../dist/lib', import.meta.url)),
            exports: 'named',
            preserveModules: true,
            preserveModulesRoot: fileURLToPath(new URL('../../../packages', import.meta.url)),
            sourcemap: true,
            entryFileNames: `[name].js`
        })

        await Promise.all([esmPromise, cjsPromise])
        console.log('多模块构建成功');
    } catch (error) {
        console.error('多模块构建失败', error);
        throw error;
    }
}
```

getFiles 方法用于获取打包文件列表，我们在 `build-infos.ts` 中编写：

hony-ui/build/src/build-infos.ts

``` ts
import glob from 'fast-glob';
import {fileURLToPath} from 'node:url';

export const getFiles = async () => {
    return await glob('**/*.{js,ts,vue}', {
        cwd: fileURLToPath(new URL('../../packages/', import.meta.url)),
        absolute: true,
        onlyFiles: true,
        ignore: ['dist/**', 'node_modules/**', 'components.d.ts', 'vite.config.ts'] // 忽略 packages/dist 和 packages/node_modules
    });
};

```

这里，我们使用 `fast-glob` 库，通过 `cwd` 配置项指定打包目录，通过 `ignore` 配置项忽略不需要打包的文件。

记得安装 `fast-glob` 依赖：

hony-ui/build

``` bash
pnpm add -D fast-glob
```

然后，我们在 `gulpfile.ts` 中调用 `buildModules` 方法。

hony-ui/build/gulpfile.ts

``` ts
import {dest, parallel, series, src, task} from 'gulp';
import {buildFull} from '@hony-ui/build/src/tasks/rollup-full';
import {buildModules} from '@hony-ui/build/src/tasks/rollup-modules';

task('build', parallel(buildFull, buildModules));

```

最后，我们在build目录下运行 `pnpm build`，即可完成组件库的完整打包和多入口打包。

打包的目录结构如下：

``` perl
hony-ui
└── dist
    ├── dist
    │   └── index.umd.ts
    ├── es
    │   ├── components
    │   │   ├── hony-button
    │   │   │   ├── src
    │   │   │   │   ├── index.vue.mjs
    │   │   │   │   └── index.vue2.mjs
    │   │   │   └── index.mjs
    │   │   ├── hony-input
    │   │   │   ├── src
    │   │   │   │   ├── index.vue.mjs
    │   │   │   │   └── index.vue2.mjs
    │   │   │   └── index.mjs
    │   │   └── hony-horizontal-scroll
    │   │       ├── src
    │   │       │   ├── index.vue.mjs
    │   │       │   └── index.vue2.mjs
    │   │       └── index.mjs
    │   └── index.mjs
    └── lib
        ├── components
        │   ├── hony-button
        │   │   ├── src
        │   │   │   ├── index.vue.js
        │   │   │   └── index.vue2.js
        │   │   └── index.js
        │   ├── hony-input
        │   │   ├── src
        │   │   │   ├── index.vue.js
        │   │   │   └── index.vue2.js
        │   │   └── index.js
        │   └── hony-horizontal-scroll
        │       ├── src
        │       │   ├── index.vue.js
        │       │   └── index.vue2.js
        │       └── index.js
        └── index.js
```

其中，`dist` 目录下存放着完整打包的结果，`es` 目录下存放着按需打包的 es 模块，`lib` 目录下存放着按需打包的 cjs 模块。

### 生成类型定义文件

接下来，我们使用 `vue-tsc` 生成类型定义文件，以便支持 typescript 开发。

首先，我们需要安装 `vue-tsc` 依赖，因为其他项目也可能依赖它，所以我直接安装在了根目录下：

hony-ui/

``` bash
pnpm add -D vue-tsc --workspace-root
```

然后，我们在tasks目录下新增 `generate-types.ts` 脚本：

hony-ui/build/src/tasks/generate-types.ts

``` ts
import {exec} from 'child_process'
import {fileURLToPath} from 'node:url'

// tsconfig.json 文件路径
const configFile = fileURLToPath(new URL('../../../packages/tsconfig.json', import.meta.url))

export const generateTypes = async () => {
    try {
        const result = await new Promise<string>((resolve, reject) => {
            exec(`npx vue-tsc --declaration --emitDeclarationOnly -p ${configFile}`, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`生成类型声明文件时出错: ${error.message}`));
                    return
                }
                if (stderr) {
                    console.error(`标准错误输出: ${stderr}`)
                }
                resolve(stdout);
            })
        });
        console.log(`标准输出: ${result}`);
        console.log('类型声明文件已成功生成');
    } catch (error) {
        console.error(`生成类型声明文件时出错: ${(error as Error).message}`)
        throw error;
    }
}
```

组件库的tsconfig.json文件如下:

hony-ui/packages/tsconfig.json

``` json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "../dist/types",
    "tsBuildInfoFile": "../dist/temp/.tsbuildinfo", // 将文件存储在临时目录
    "types": ["node"]
  },
  "include": ["**/*"]
}
```

在 `gulpfile.ts` 中调用 `generateTypes` 方法：

hony-ui/build/gulpfile.ts

``` ts
import {dest, parallel, series, src, task} from 'gulp';
import {buildFull} from '@hony-ui/build/src/tasks/rollup-full';
import {buildModules} from '@hony-ui/build/src/tasks/rollup-modules';
import {generateTypes} from '@hony-ui/build/src/tasks/generate-types';

task('default', parallel(buildFull, buildModules, generateTypes));
```

最后，我们在build目录下运行 `pnpm build`，即可完成组件库的完整打包、多入口打包和类型定义文件生成。

生成的类型定义文件存放在 `dist/types` 目录下。

## 使用gulp完成清理和复制等工作

最后，我们使用 gulp 完成一些其他工作，比如清理、复制等。

首先，我们安装 gulp 相关依赖：

hony-ui/build

``` bash
pnpm add -D gulp gulp-clean del fs-extra @types/fs-extra
```

### 打包前清理打包目录

我们将在打包前清理打包目录，以避免上次打包遗留的垃圾文件。

hony-ui/build/gulpfile.ts

``` ts
// 清理打包输出目录
task('clean-dist', () => {
    return src(resolvePath(paths.rootDist), {allowEmpty: true, read: false})
        .pipe(clean({force: true}))
        .on('end', () => logSuccess('清理目录'))
        .on('error', (error) => logError('清理目录', error));
})

task('default', series('clean-dist', parallel(buildFull, buildModules, generateTypes)));
```

### 移动类型定义文件

我们需要将 `dist/types` 目录下的类型定义文件按照目录结构复制到 `dist/lib` 和 `dist/es` 目录下，将 `dist/types/index.d.ts`
复制到 `dist/dist` 目录下。

完成复制后，清理 `dist/types` 目录和 `dist/temp` 目录。

hony-ui/build/gulpfile.ts

``` ts
// 文件复制任务的通用函数
const copyFiles = (srcPath: string, destPaths: string[], successMessage: string) =>
    Promise.all(
        destPaths.map(destDir =>
            new Promise<void>((resolve, reject) => {
                src(resolvePath(srcPath))
                    .pipe(dest(resolvePath(destDir)))
                    .on('end', () => resolve())
                    .on('error', reject);
            })
        )
    )
        .then(() => logSuccess(successMessage))
        .catch(error => logError(successMessage, error));

// 复制类型文件任务
const copyTypes = () => copyFiles(paths.typesSrc, paths.destDirs, '类型定义文件复制');

// 复制 index.d.ts 文件任务
const copyIndexType = () => copyFiles(paths.indexTypeSrc, [paths.distDest], 'index.d.ts 文件复制');

// 清理类型定义文件目录
const cleanTypes = () => {
    return src([paths.typesDir, paths.tempDir], {allowEmpty: true, read: false})
        .pipe(clean({force: true}))
        .on('end', () => logSuccess('类型文件夹删除'))
        .on('error', (error) => logError('删除类型文件夹', error));
}

task('build-types', series(generateTypes, parallel(copyTypes, copyIndexType), cleanTypes))

task('default', series('clean-dist', parallel(buildFull, buildModules, 'build-types')));
```

### 复制并修改package.json文件

最后，我们需要复制 `package.json` 文件，并修改其中的 `main`、`module`、`types` 字段。

hony-ui/build/gulpfile.ts

``` ts
// 修改 package.json 文件任务
const modifyPackageJson = async () => {
    try {
        const data = await fs.promises.readFile(resolvePath(paths.packageJsonSrc), 'utf8');
        const packageJson = JSON.parse(data);
        packageJson.main = './lib/index.js';
        packageJson.module = './es/index.mjs';
        packageJson.types = './es/index.d.ts';
        await fs.promises.writeFile(resolvePath(paths.packageJsonDest), JSON.stringify(packageJson, null, 2), 'utf8');
        logSuccess('package.json 文件修改');
    } catch (error) {
        logError('修改 package.json 文件', error);
    }
};

task('default', series('clean-dist', parallel(buildFull, buildModules, 'build-types'), modifyPackageJson));
```

## 总结

至此，我们完成了 gulp 构建脚本，可以完成组件库的完整打包、多入口打包、类型定义文件生成、清理、复制等工作。

## 问题记录

### 无法按需加载

完成上述打包后，我们在项目中使用 `import {HonyButton} from 'hony-ui'`，项目打包后分析发现，所有 `hony-ui` 的组件都被打包进来了，并没有实现按需加载。

解决方案：

rollup在打包时发现部分组件有副作用，因此没有正常对其进行Tree Shaking。

因此，我们在 组件库的`package.json` 中暂时添加 `"sideEffects": false` 字段，告诉rollup，组件库整体没有副作用，可放心进行Tree Shaking。

后续，我们添加样式后，可以再详细配置sideEffects字段，告诉rollup哪些组件有副作用，哪些组件没有副作用。







