<template>
    <div class="blogs" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="blogs__container">
            <el-breadcrumb separator="/" class="blogs__breadcrumb">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ route.params.componentName }}</el-breadcrumb-item>
            </el-breadcrumb>

            <div class="blogs__divider"></div>

            <el-scrollbar>
                <Component :is="BlogDetail" class="blogs__content"/>
            </el-scrollbar>
        </div>
    </div>
</template>
<script setup lang="ts">
import {defineAsyncComponent, onMounted, ref} from 'vue'
import {getWallpaperFromCache} from '@/utils/bingWallpaper.ts'
import {useRoute} from 'vue-router'
import CreateUILib from './CreateUILib.md'

defineOptions({name: 'Blogs'})

const backgroundImage = ref('')
const route = useRoute();
const componentMap = {
    CreateUILib: () => import('./CreateUILib.md'),
    LibGlobalTypeError: () => import('./LibGlobalTypeError.md'),
    LibDev: () => import('./LibDev.md'),
    HorizontalScroll: () => import('./HorizontalScroll.md'),
    LibImport: () => import('./LibImport.md'),
    TypeScriptForImport: () => import('./TypeScriptForImport.md'),
    GulpBuild: () => import('./GulpBuild.md'),
    StyleImport: () => import('./StyleImport.md'),
    NotFound: () => import('./NotFound.vue')
};

console.log(CreateUILib);
const componentName = route.params.componentName as string;
const BlogDetail = defineAsyncComponent(() => {
    if (componentName && componentName in componentMap) {
        return componentMap[componentName as keyof typeof componentMap]();
    } else {
        return componentMap['NotFound'](); // 如果找不到对应的组件，返回 NotFound 组件
    }
});

onMounted(async () => {
    const imageUrl = await getWallpaperFromCache();
    if (imageUrl) {
        backgroundImage.value = imageUrl;
    }
});
</script>
<style lang="scss" scoped>
.blogs {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

  &__container {
    width: 100%;
    max-width: 1200px;
    height: 100%;
    padding: 2rem 1rem;
    background-color: rgba(255, 255, 255, 0.9);
  }

  &__breadcrumb {
    font-size: 16px;
  }

  &__divider {
    height: 3px;
    background-color: #ccc;
    margin: 1rem 0;
  }

  &__content {
    padding: 2rem;
  }
}
</style>
