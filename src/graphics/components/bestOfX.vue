<!-- This component handles displays each player's information within a team. -->
<!-- This is added dynamically to the PlayerContainer component when we need to show this. -->
<!-- It is initialised with most info, it only listens to nodecg-speedcontrol for finish times. -->

<script setup lang="ts">
    import { computed } from 'vue';
    import { bestOfX } from '../../browser_shared/replicants';

    const props = withDefaults(
        defineProps<{
            playerIndex: number;
            height?: string;
        }>(),
        {
            height: '55px'
        }
    );

    const score = computed(() => {
        return bestOfX?.data?.matchCounts[props.playerIndex] ?? 0;
    });

    const totalMatches = computed(() => {
        return bestOfX?.data?.totalMatches ?? 0;
    });
</script>

<template>
    <div class="MatchCounter FlexContainer">
        <div
            v-for="i in Math.ceil(totalMatches / 2)"
            :key="i"
            class="ScoreCounter FlexContainer"
            :style="{ height: height }"
        >
            <div
                v-if="i <= score"
                class="Score Counter"
                :style="{ height: height }"
            >
                <div
                    class="ScoreIndicator"
                    :style="{ height: height }"
                ></div>
            </div>
            <div
                v-else
                class="NoScore Counter"
                :style="{ height: height }"
            >
                <div
                    class="ScoreIndicator grey"
                    :style="{ height: height }"
                ></div>
            </div>
        </div>
    </div>
</template>
<style>
    .ScoreCounter > .Counter {
        margin-right: 10px;
        width: auto;
        position: relative;
    }

    .ScoreCounter > .Counter > img {
        height: 100%;
        width: auto;
        position: relative;
        filter: drop-shadow(0 0 0.75rem);
    }

    .ScoreCounter {
        width: 100%;
    }

    .ScoreCounter > .Score > img {
        height: 90px;
    }

    .ScoreIndicator {
        width: 20px;
        background-color: gold;
    }

    .MatchCounter > img {
        height: 100%;
        position: absolute;
        filter: invert(1);
    }

    .MatchCounter.ScoreCounter.NoScore > img {
        filter: grayscale(100%);
    }

    .grey {
        filter: grayscale(100%);
    }

    .MatchCounter {
        height: 50px;
        margin-right: 10px;
    }
</style>
