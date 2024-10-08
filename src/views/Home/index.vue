<template>
    <div class="home" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="home__container">
            <left-side :avatarSrc="avatarSrc"></left-side>
            <right-container></right-container>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {getWallpaperFromCache} from '@/utils/bingWallpaper.ts';
import LeftSide from '@/views/Home/LeftSide.vue'
import RightContainer from '@/views/Home/RightContainer.vue'

interface HomeProps {
    avatarSrc: string;
    title: string;
    description: string;
    email: string;
    githubLink: string;
    linkedinLink: string;
    projects: { id: number, title: string, description: string }[];
    blogs: { id: number, title: string, link: string }[];
}

defineProps<HomeProps>();
const backgroundImage = ref('');

onMounted(async () => {
    const imageUrl = await getWallpaperFromCache();
    if (imageUrl) {
        backgroundImage.value = imageUrl;
    }
});
</script>

<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

  &__container {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
  }
}
</style>
