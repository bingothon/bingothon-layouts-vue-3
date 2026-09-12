<template>
    <div class="q-gutter-sm">
        <QRadio
            v-for="theme in themeOptions"
            :key="theme"
            v-model="themeReplicant!.data!.theme"
            :val="theme"
            :label="theme"
            @update:model-value="themeReplicant!.save()"
        />
    </div>
</template>

<script setup lang="ts">
    import { themeReplicant } from '../../browser_shared/replicants';
    import type { Theme } from '../../types/schemas';
    const themeOptions: Theme['theme'][] = ['summer', 'winter', 'neutral'];
</script>

<style></style>
