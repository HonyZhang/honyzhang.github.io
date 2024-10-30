---
title: 同时支持全局注册和自动按需导入的解决方案
date: 2024-10-30
componentName: TypeScriptForImport
tags:
  - Vue
  - Vite
  - 组件库
  - 全局注册
  - TypeScript
---

# 同时支持全局注册和自动按需导入的解决方案

[[toc]]

上篇文章写了组件库的按需导入，本来要开始写样式的按需导入了，结果被同事发现自动导入的代码存在问题，无法完成导入。

hony-ui/lib/components/HonyButton/index.ts

```typescript
import HonyButton from './src/index.vue';
import {App} from '@vue/runtime-core'

const install = (app: App): void => {
    app.component(HonyButton.name!, HonyButton);
};

export default {
    install
};
```

这样的写法导致 `unplugin-vue-components` 插件类似于下面的导入：
```typescript
import HonyButton from 'hony-ui/es/components/HonyButton/index.ts'
```

这种导入并没有成功拿到 `HonyButton` 组件，因为它根本没有被导出。

那么，如何让插件实现类似于下边的导入方式呢？

```typescript
import HonyButton from 'hony-ui/lib/components/HonyButton/src/index.vue'
```

这就需要修改组件的入口文件

```typescript
import HonyButton from './src/index.vue';
import {type App} from 'vue';

HonyButton.install = (app: App): void => {
    app.component(HonyButton.name!, HonyButton);
};

export default HonyButton 
```

我们直接在组件上添加 `install` 方法，并将组件导出。这样，`app.use(HonyButton)` 可以正常工作，插件也能正确导入组件。

但是，现实是残酷的，组件虽然可以正常使用了，但是在全局注册时ts报错了

<img src="/images/blogs/TsImport-1.png" alt="ts报错提示" width="100%">

从报错信息上看，是因为 `HonyButton` 是一个vue组件类型的对象，而app.use()只能接收类型为`Plugin`的对象，两者不兼容。

----

Element-Plus 既然也支持全局注册和自动按需导入，那么我们就来看看它是如何实现的。

```typescript
import { withInstall, withNoopInstall } from '@element-plus/utils'
import Button from './src/button.vue'
import ButtonGroup from './src/button-group.vue'
import type { SFCWithInstall } from '@element-plus/utils'

export const ElButton: SFCWithInstall<typeof Button> & {
  ButtonGroup: typeof ButtonGroup
} = withInstall(Button, {
  ButtonGroup,
})
export const ElButtonGroup: SFCWithInstall<typeof ButtonGroup> =
  withNoopInstall(ButtonGroup)
export default ElButton

export * from './src/button'
export * from './src/constants'
export type { ButtonInstance, ButtonGroupInstance } from './src/instance'
```

withInstall()负责实现 `Button` 组件的 `install()` 方法，我们看一下 `withInstall()` 的实现。

```typescript
export const withInstall = <T, E extends Record<string, any>>(
    main: T,
    extra?: E
) => {
    ;(main as SFCWithInstall<T>).install = (app): void => {
        for (const comp of [main, ...Object.values(extra ?? {})]) {
            app.component(comp.name, comp)
        }
    }

    if (extra) {
        for (const [key, comp] of Object.entries(extra)) {
            ;(main as any)[key] = comp
        }
    }
    return main as SFCWithInstall<T> & E
}
```

看来关键在于`SFCWithInstall<T>`这个类型，我们来看一下它的定义。

```typescript
import type { AppContext, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}
```

okay，到这里我们基本上看懂原理了，抛开一系列的类型体操，本质上是下边的实现逻辑：

```typescript
import HonyButton from './src/index.vue';
import type {App, Plugin} from 'vue';

HonyButton.install = (app: App): void => {
    app.component(HonyButton.name!, HonyButton);
};

export default HonyButton as typeof HonyButton & Plugin
```

将 `HonyButton` 组件的类型转换为 `typeof HonyButton & Plugin`，`app.use()` 就可以正常工作了。

---

PS: 有时候，TypeScript也是挺烦的