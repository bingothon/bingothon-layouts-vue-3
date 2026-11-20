<template>
    <div>
        <QBtn
            id="buzzer"
            color="primary"
            dark
            square
            :disable="!buzzerOpen"
            @click="buzz"
            >BUZZ</QBtn
        >
        <div id="bar">
            <div id="fullBar"></div>
            <div
                v-if="timerLeftMs > 0"
                id="progressbar"
                :style="{ width: `${(timerLeftMs / timeToAnswer) * 100}%`, backgroundColor: color }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import { bingoboardMeta, quizBuzzersReplicant, thisBundle } from '../../browser_shared/replicants.ts';

    let timerCountdown: NodeJS.Timeout | undefined;

    const playerNumber = parseInt(new URLSearchParams(window.location.search).get('player') ?? '0');

    const timerLeftMs = ref(-1);

    const timeToAnswer = computed<number>(() => quizBuzzersReplicant?.data?.timeToAnswerMs || 10_000);

    const buzzerOpen = computed(() => quizBuzzersReplicant?.data?.open);

    const color = computed(() => bingoboardMeta?.data?.playerColors[playerNumber] || 'red');

    watch(
        () => quizBuzzersReplicant?.data?.open,
        () => {
            stopCountdown();
            const startedAt = Date.now();
            if (quizBuzzersReplicant?.data?.player?.number === playerNumber && !quizBuzzersReplicant.data.open) {
                const countdown = () => {
                    const timerEnd = startedAt + timeToAnswer.value;
                    timerLeftMs.value = Math.floor(timerEnd - Date.now());
                    if (timerLeftMs.value < 0) {
                        stopCountdown();
                    }
                };
                countdown();
                timerCountdown = setInterval(countdown, 100);
            }
        }
    );

    function stopCountdown(): void {
        clearInterval(timerCountdown);
        timerCountdown = undefined;
    }

    function buzz() {
        nodecg.sendMessageToBundle('quiz:buzzer', thisBundle, { player: playerNumber });
    }
</script>

<style scoped>
    #buzzer {
        position: absolute;
        top: 0;
        left: 0;
        width: 300px;
        height: 200px;
    }

    #bar {
        position: absolute;
        width: 300px;
        top: 250px;
        height: 50px;
    }

    #fullBar,
    #progressbar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
    }

    #fullBar {
        width: 100%;
        background-color: grey;
    }

    #progressbar {
        transition: width 0.01s;
    }
</style>
