<template>
    <blurb-display
        type="charity"
        :is-primary="isPrimary"
    />
    <blurb-display
        type="bingothon"
        :is-primary="isPrimary"
    />
    <blurb-display
        type="sponsor"
        :is-primary="isPrimary"
    />
</template>

<script setup lang="ts">
    import BlurbDisplay from './blurbDisplay.vue';

    withDefaults(
        defineProps<{
            isPrimary?: boolean;
        }>(),
        {
            isPrimary: false
        }
    );
</script>

<style scoped></style>
