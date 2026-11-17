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
        <BingoBoard
            id="Bingo-board"
            font-size="20px"
            bingoboard-rep="quizBingoCells"
            :bingo-rep-bundle="thisBundle"
        ></BingoBoard>
        <DiscordDisplay
            id="discord-voice"
            :mic-height-px="30"
            :icon-height-px="75"
            :max-user-count="5"
            :name-width-px="220"
            voice-highlight-color="var(--discord-voice-highlight-color)"
        ></DiscordDisplay>
        <QuestionOverlay></QuestionOverlay>
    </div>
</template>

<script setup lang="ts">
    import { themeClass } from '../theme.ts';
    import BingoBoard from '../components/bingoboard/bingoBoard.vue';
    import DiscordDisplay from '../components/discordDisplay.vue';
    import PlayerInfo from '../components/runnerInfo/playerInfo.vue';
    import { thisBundle } from '../../browser_shared/replicants.ts';
    import QuestionOverlay from './components/QuestionOverlay.vue';
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
        top: 150px;
        left: 610px;
        width: 700px;
        height: 700px;
    }

    #discord-voice {
        position: absolute;
        top: 920px;
        left: 20px;
        width: 1880px;
        height: 80px;
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

    #pi0 {
        left: 30px;
    }

    #pi1 {
        right: 30px;
    }

    .player {
        position: absolute;
        top: 500px;
        width: 400px;
    }
</style>
