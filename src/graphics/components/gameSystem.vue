<template>
    <div
        id="GameSystem"
        class="GameSystem Chip"
    >
        <img
            v-if="gameSystemImage"
            :src="gameSystemImage"
        />
        <span
            v-if="!gameSystemImage || pathsAndLogos[gameSystem.toLocaleLowerCase()].textNeeded"
            class="ChipText"
        >
            {{ gameSystem }}
        </span>
    </div>
</template>

<script setup lang="ts">
    import { pathsAndText } from './helpers/consoleLogoPaths';
    import { computed } from 'vue';

    const props = defineProps({ gameSystem: { type: String, required: true } });

    const pathsAndLogos = computed(() => pathsAndText);

    const gameSystemImage = computed<string>(() => {
        const imagePath = pathsAndLogos.value[props.gameSystem.toLocaleLowerCase()]?.logoPath;
        if (imagePath) {
            return `/bundles/bingothon-layouts/static/game-systems/${imagePath}`;
        }
        return '';
    });
</script>

<style scoped>
    #GameSystem {
        display: flex;
        align-items: center;
    }

    .GameSystem img {
        width: auto;
        max-width: 100px;
        height: 25px;
    }
</style>
