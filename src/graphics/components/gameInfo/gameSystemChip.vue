<template>
    <div class="GameSystem GameChip Flexbox">
        <img
            v-if="gameSystemImage"
            :src="gameSystemImage"
        />
        <span
            v-if="
                !gameSystemImage ||
                (pathsAndTexts[gameSystem.toLocaleLowerCase()] ?? pathsAndTexts['default']).textNeeded
            "
            class="ChipText"
        >
            {{ gameSystem }}
        </span>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { thisBundle } from '../../../browser_shared/replicants';

    const { gameSystem } = defineProps<{
        gameSystem: string;
    }>();

    // TODO: Outsource to own file and update for all systems needed
    const pathsAndTexts: { [key: string]: { logoPath?: string; textNeeded: boolean } } = {
        // fallback for unknown systems
        default: { logoPath: 'testConsole.svg', textNeeded: true }
    };

    const gameSystemImage = computed(() => {
        const entry = pathsAndTexts[gameSystem.toLocaleLowerCase()] ?? pathsAndTexts['default'];
        const imagePath = entry?.logoPath;
        if (imagePath) {
            return `/bundles/${thisBundle}/assets/${imagePath}`;
        }
        return undefined;
    });
</script>

<style scoped>
    .GameSystem img {
        width: auto;
        max-width: 100px;
        height: 25px;
    }
</style>
