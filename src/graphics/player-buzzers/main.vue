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
        <bingo-board
            id="Bingo-board"
            font-size="20px"
            bingoboard-rep="quizBingoCells"
            :bingo-rep-bundle="thisBundle"
        ></bingo-board>
    </div>
    <div
        v-if="question"
        id="question"
    >
        {{ question }}
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import {
        bingoboardMeta,
        quizBingoReplicant,
        quizBuzzersReplicant,
        thisBundle
    } from '../../browser_shared/replicants.ts';
    import BingoBoard from '../components/bingoboard/bingoBoard.vue';

    let timerCountdown: NodeJS.Timeout | undefined;

    const playerNumber = parseInt(new URLSearchParams(window.location.search).get('player') ?? '0');

    const timerLeftMs = ref(-1);

    const timeToAnswer = computed<number>(() => quizBuzzersReplicant?.data?.timeToAnswerMs || 10_000);

    const buzzerOpen = computed(() => quizBuzzersReplicant?.data?.open);

    const color = computed(() => bingoboardMeta?.data?.playerColors[playerNumber] || 'red');

    const question = computed(() => {
        const currentlySelected = quizBingoReplicant?.data?.currentlySelected;
        if (!currentlySelected) {
            return undefined;
        }
        return quizBingoReplicant?.data?.questions?.[currentlySelected.column][currentlySelected.row].question;
    });

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

    #Bingo-board {
        position: absolute;
        top: 0;
        left: 400px;
        width: 500px;
        height: 500px;
    }

    #question {
        position: absolute;
        font-size: 20px;
        top: 350px;
        width: 300px;
        left: 0;
        color: white;
        white-space: pre-line;
    }
</style>
