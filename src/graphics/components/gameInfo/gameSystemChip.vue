<template>
    <div class="GameSystem GameChip FlexContainer">
        <img
            v-if="gameSystemImage"
            :src="gameSystemImage"
        />
        <span
            v-if="!gameSystemImage || pathsAndText[gameSystem.toLocaleLowerCase()].textNeeded"
            class="ChipText"
        >
            {{ gameSystem }}
        </span>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { oldBundle } from '../../../browser_shared/replicants';
    import { pathsAndText } from '../helpers/consoleLogoPaths';

    const props = defineProps({ gameSystem: { type: String, required: true } });

    const pathsAndLogos = computed(() => pathsAndText);

    const gameSystemImage = computed<string>(() => {
        const imagePath = pathsAndLogos.value[props.gameSystem.toLocaleLowerCase()]?.logoPath;
        if (imagePath) {
            return `/bundles/${oldBundle}/static/game-systems/${imagePath}`;
        }
        return '';
    });
</script>

<style scoped>
    .GameSystem img {
        width: auto;
        max-width: 100px;
        height: 20px;
    }
</style>
