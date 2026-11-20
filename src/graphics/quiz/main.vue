<template>
    <div
        class="Quiz"
        :class="themeClass"
    >
        <img
            id="logo"
            :src="`../../assets/logo-${themeClass}-wide.png`"
        />
        <img
            id="quizSecondaryLogo"
            :src="`../../assets/Fred-Hutch-Logo-Full-Color-RGB_WHITE.png`"
        />
        <BingoBoard
            id="Bingo-board"
            font-size="20px"
            bingoboard-rep="quizBingoCells"
            :bingo-rep-bundle="thisBundle"
        ></BingoBoard>
        <QuestionOverlay></QuestionOverlay>
        <PlayerInfo
            id="pi0"
            class="player"
            :player-index="0"
            :show-color="true"
            :hide-sound-icon="true"
            :height-px="60"
        ></PlayerInfo>
        <PlayerInfo
            id="pi1"
            class="player"
            :player-index="1"
            :show-color="true"
            :hide-sound-icon="true"
            :height-px="60"
        ></PlayerInfo>
        <PlayerInfo
            id="pi2"
            class="player"
            :player-index="2"
            :hide-sound-icon="true"
            :show-color="false"
            :height-px="60"
        ></PlayerInfo>
        <div
            id="camP0"
            class="cam"
        ></div>
        <div
            id="camP1"
            class="cam"
        ></div>
        <div
            id="camHost"
            class="cam"
        ></div>
        <div id="fullProgressContainer">
            <div
                v-if="timerLeftMs > 0"
                id="progressBar"
                :style="
                    playerBuzzerColor
                        ? { backgroundColor: playerBuzzerColor, width: `${(timerLeftMs / timeToAnswer) * 100}%` }
                        : {}
                "
            ></div>
        </div>
        <div id="omnibarPlaceHolder"></div>
    </div>
</template>

<script setup lang="ts">
    import { themeClass } from '../theme.ts';
    import BingoBoard from '../components/bingoboard/bingoBoard.vue';
    import PlayerInfo from '../components/runnerInfo/playerInfo.vue';
    import { bingoboardMeta, quizBuzzersReplicant, thisBundle } from '../../browser_shared/replicants.ts';
    import QuestionOverlay from './components/QuestionOverlay.vue';
    import { computed, ref, watch } from 'vue';

    let timerCountdown: NodeJS.Timeout | undefined;

    const timerLeftMs = ref(-1);

    const timeToAnswer = computed(() => quizBuzzersReplicant?.data?.timeToAnswerMs || 10_000);

    const playerBuzzerColor = computed<string | undefined>(
        () => bingoboardMeta?.data?.playerColors[quizBuzzersReplicant?.data?.player?.number ?? -1]
    );

    watch(
        () => quizBuzzersReplicant?.data?.open,
        () => {
            stopCountdown();
            const startedAt = Date.now();
            if (quizBuzzersReplicant?.data?.player && !quizBuzzersReplicant.data.open) {
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
</script>

<style scoped>
    .Quiz {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 1920px;
        height: 1080px;
        background: linear-gradient(-128deg, var(--gradient-light) 0, var(--gradient-dark) 100%) 100% no-repeat fixed;
    }

    #Bingo-board {
        position: absolute;
        top: 100px;
        left: 560px;
        width: 800px;
        height: 800px;
    }

    #logo {
        position: absolute;
        left: 60px;
        top: 50px;
        height: 100px;
    }

    #quizSecondaryLogo {
        position: absolute;
        right: 60px;
        top: 50px;
        height: 100px;
    }

    #pi0,
    #pi1,
    #camP0,
    #camP1 {
        left: 30px;
    }

    #pi0 {
        top: 425px;
    }

    #pi1 {
        top: 615px;
    }

    #camP0 {
        top: 200px;
    }

    #camP1 {
        top: 675px;
    }

    #camHost {
        top: 350px;
        right: 30px;
    }

    .player {
        position: absolute;
        width: 400px;
    }

    #pi2 {
        position: absolute;
        top: 575px;
        width: 400px;
        right: 30px;
    }

    .cam {
        position: absolute;
        width: 400px;
        height: 225px;
        background-color: green;
    }

    #fullProgressContainer {
        position: absolute;
        top: 540px;
        left: 30px;
        height: 10px;
        width: 400px;
        border-radius: 20px;
    }

    #omnibarPlaceHolder {
        position: absolute;
        left: 0;
        top: 1000px;
        width: 1920px;
        height: 80px;
        background-color: grey;
    }

    #progressBar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 20px;
        transition: width 0.1s;
    }
</style>
