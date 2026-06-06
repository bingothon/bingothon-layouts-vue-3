<template>
    <div
        class="TwitchPlayerContainer"
        :data-index="streamIndex"
    />
</template>

<script setup lang="ts">
    defineProps<{ streamIndex: number }>();
</script>

<style scoped>
    .TwitchPlayerContainer {
        box-sizing: border-box;
    }
</style>
