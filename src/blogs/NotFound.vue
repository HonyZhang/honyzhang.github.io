<template>
    <div class="not-found">
        <div class="not-found__content">
            <h1 class="not-found__title">404 - 页面未找到</h1>
            <p class="not-found__message">抱歉，您访问的页面不存在。</p>
            <router-link to="/">
                <button class="not-found__button">返回首页</button>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
// 不需要任何额外的脚本逻辑
</script>

<style scoped lang="scss">
.not-found {
  &__content {
    text-align: center;
    margin-top: 100px;
  }

  &__title {
    font-size: 2.5em;
    color: #ff5c5c;
  }

  &__message {
    font-size: 1.2em;
    color: #666;
  }

  &__button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1em;
    color: white;
    background-color: #ff5c5c;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #ff8080;
    }
  }
}
</style>