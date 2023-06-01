<script setup lang="ts">
const router = useRouter()
</script>
<template>
  <div class="bar">
    <q-btn icon="arrow_back" rounded color="grey" @click="router.back()" class="back-button" />
    <slot name="left"></slot>
    <q-space />
    <slot name="right"></slot>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  padding: 8px 12px 8px 12px;
  margin-bottom: 20px;
}
.back-button {
  margin-left: 10px;
}
</style>
