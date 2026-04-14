<template>
    <div class="GameDetails FlexContainer">
        <div class="GameName FlexContainer">{{ gameName }}</div>
        <div class="GameExtra FlexContainer">
            <GameSystemChip
                v-if="gameSystem"
                :game-system="gameSystem"
            />
            <div class="GameChip FlexContainer">{{ gameCategory }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { runDataActiveRunReplicant } from '../../../browser_shared/replicants';
    import GameSystemChip from './gameSystemChip.vue';

    const gameName = computed(() => runDataActiveRunReplicant?.data?.game);
    const gameSystem = computed(() => runDataActiveRunReplicant?.data?.system);
    const gameCategory = computed(() => runDataActiveRunReplicant?.data?.category);
</script>

<style>
    .GameDetails {
        align-content: center;
        flex-direction: column;
        text-align: center;
        row-gap: 8px;
    }

    .GameDetails > .GameName {
        font-size: 30px;
        color: white;
    }

    .GameExtra {
        column-gap: 8px;
        padding: 0 4px;
    }

    .GameExtra img {
        margin-left: 5px;
        max-width: 100px;
        max-height: 19px;
    }

    .GameDetails img {
        max-width: 60px;
        max-height: 60px;
    }

    .GameChip {
        text-align: center;
        height: 28px;
        padding: 0 6px;
        background-color: rgba(220, 240, 255, 0.9);
        border-radius: 2px;
        font-size: 17px;
        color: #333;
        border: 1px solid rgba(180, 230, 255, 0.7);
        box-shadow: 0px 0px 5px 2px rgba(200, 240, 255, 0.3);
    }
</style>
