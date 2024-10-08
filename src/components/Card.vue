<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">

</script>
<style lang="scss" scoped>
.card {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 16px;
  color: rgb(238, 238, 238);
}
</style>