<template>
    <div class="Cam-Names">
        <PlayerInfo
            v-for="(player, i) in players"
            :id="`pi${i}`"
            :key="i"
            class="PlayerInfo"
            :style="playerCountToPositions[playerCount - 1][i]"
            :player-index="i"
            height="45px"
            :show-color="false"
        ></PlayerInfo>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import PlayerInfo from '../components/runnerInfo/playerInfo.vue';
    import { players } from '../game-layout/layouts/common';

    const playerCount = computed(() => players.value.length);

    const playerCountToPositions = [
        [
            {
                top: '945px',
                left: '480px',
                width: '960px'
            }
        ],
        [
            {
                top: '945px',
                left: '0px',
                width: '959px'
            },
            {
                top: '945px',
                left: '960px',
                width: '959px'
            }
        ],
        [
            {
                top: '945px',
                left: '0px',
                width: '639px'
            },

            {
                top: '945px',
                left: '640px',
                width: '639px'
            },

            {
                top: '945px',
                left: '1280px',
                width: '639px'
            }
        ],
        [
            {
                top: '442px',
                left: '0px',
                width: '959px'
            },
            {
                top: '442px',
                left: '960px',
                width: '959px'
            },
            {
                top: '945px',
                left: '0px',
                width: '959px'
            },
            {
                top: '945px',
                left: '960px',
                width: '959px'
            }
        ]
    ];
</script>

<style>
    .Cam-Names > .PlayerInfo {
        position: absolute;
    }
</style>
