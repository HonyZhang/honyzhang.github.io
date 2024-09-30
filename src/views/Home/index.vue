<template>
    <div class="home" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="home__content">
            <Avatar src="path/to/your/avatar.jpg"/>
            <h1 class="home__title">{{ title }}</h1>
            <p class="home__description">{{ description }}</p>
            <button class="home__button" @click="learnMore">{{ buttonText }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import Avatar from '@/components/Avatar.vue'
import {getSingleWallpaper} from '@/utils/bingWallpaper.ts'

interface HomeProps {
    title: string
    description: string
    buttonText: string
}

defineProps<HomeProps>()
const backgroundImage = ref('')

// 获取 Bing 壁纸并设置为背景图
onMounted(async () => {
    const imageUrl = await getSingleWallpaper()
    if (imageUrl) {
        backgroundImage.value = imageUrl
    }
})

const learnMore = () => {
    alert('了解更多信息')
}
</script>

<style scoped lang="scss">
.home {
  /* 确保背景图片覆盖整个视口 */
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

  &__content {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
    padding: 2rem;
    border-radius: 10px;
    color: white;
  }

  &__title {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &__description {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  &__button {
    background-color: #3498db;
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #2980b9;
    }
  }
}
</style>
