<template>
    <div id="app">
        <router-view/> <!-- 动态加载路由对应的组件，如 Home.vue -->
    </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'

onMounted(() => {
    // 创建 link 元素
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = import.meta.env.VITE_ICONFONT_API_URL;  // 外链地址

    // 将 link 元素添加到 head
    document.head.appendChild(link);
})
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
