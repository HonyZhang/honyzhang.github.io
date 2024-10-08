<template>
    <div class="avatar">
        <img :src="src" alt="Avatar" class="avatar__image" />
    </div>
</template>

<script setup lang="ts">
interface AvatarProps {
    src: string;  // 接收头像图片的路径
}
defineProps<AvatarProps>()
</script>

<style scoped>
.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #3498db;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
