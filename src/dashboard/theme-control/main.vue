<template>
    <div class="q-gutter-sm">
        <QRadio
            v-model="themeReplicant!.data!.theme"
            val="summer"
            label="Summer"
        />
        <QRadio
            v-model="themeReplicant!.data!.theme"
            val="winter"
            label="Winter"
        />
    </div>
    <QBtn @click="() => themeReplicant!.save()">Save</QBtn>
</template>

<script setup lang="ts">
    import { themeReplicant } from '../../browser_shared/replicants';
</script>

<style></style>
