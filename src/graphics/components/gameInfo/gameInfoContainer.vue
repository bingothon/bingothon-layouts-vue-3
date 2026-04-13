<template>
    <div
        class="GameContainer GameDetails FlexContainer"
        style="flex-direction: column; row-gap: 8px"
    >
        <!-- Title in the middle -->
        <div class="GameName FlexContainer">{{ gameName }}</div>
        <!-- Other information on the middle bottom -->
        <div
            class="GameExtra FlexContainer"
            style="flex-direction: column; padding: 0 4px"
        >
            <!-- Game System Chip and Category in the same row -->
            <div
                class="FlexContainer"
                style="column-gap: 8px"
            >
                <GameSystemChip
                    v-if="gameSystem"
                    :game-system="gameSystem"
                />
                <!-- Added Category next to the Game System -->
                <div class="GameChip FlexContainer">
                    <span>{{ gameCategory }}</span>
                </div>
            </div>
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
        align-items: center;
        flex-direction: column;
        text-align: center;
    }

    .GameDetails > .GameName {
        font-size: 30px;
        color: white;
    }

    .GameExtra img {
        margin-left: 5px;
        max-width: 100px;
        max-height: 19px;
    }

    .GameContainer img {
        max-width: 60px;
        max-height: 60px;
    }

    .GameChip {
        text-align: center;
        height: 28px;
        padding: 0 6px;
        background-color: rgba(220, 240, 255, 0.9); /* Light blueish, slightly transparent */
        border-radius: 2px;
        font-size: 17px;
        color: #333;
        border: 1px solid rgba(180, 230, 255, 0.7); /* Slightly blueish border for that 'frozen' feel */
        box-shadow: 0px 0px 5px 2px rgba(200, 240, 255, 0.3); /* Subtle glow to add depth */
    }
</style>
