<template>
    <div id="app">
        <router-view/> <!-- 动态加载路由对应的组件，如 Home.vue -->
    </div>
</template>

<script setup lang="ts">
</script>

<style>
/* 全局样式 */
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden; /* 防止页面整体溢出 */
}

* {
    box-sizing: border-box; /* 确保所有元素的宽高包含内边距和边框 */
}
</style>
