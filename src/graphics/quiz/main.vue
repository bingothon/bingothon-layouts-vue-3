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
        <div id="CategoryContainer">
            <span
                v-for="category in categories"
                :key="category"
                class="Categories"
                >{{ category }}</span
            >
        </div>
        <PlayerInfo
            id="pi0"
            class="player"
            :player-index="0"
            :show-color="true"
            :hide-sound-icon="true"
            height="45px"
        ></PlayerInfo>
        <PlayerInfo
            id="pi1"
            class="player"
            :player-index="0"
            :show-color="true"
            :hide-sound-icon="true"
            height="45px"
        ></PlayerInfo>
        <BingoBoard
            id="Bingo-board"
            font-size="20px"
        ></BingoBoard>
        <DiscordDisplay
            id="discord-voice"
            :mic-height-px="30"
            :icon-height-px="75"
            :max-user-count="5"
            :name-width-px="220"
            voice-highlight-color="var(--discord-voice-highlight-color)"
        ></DiscordDisplay>
    </div>
</template>

<script setup lang="ts">
    import { themeClass } from '../theme.ts';
    import BingoBoard from '../components/bingoboard/bingoBoard.vue';
    import DiscordDisplay from '../components/discordDisplay.vue';
    import PlayerInfo from '../components/runnerInfo/playerInfo.vue';
    import { quizBingoReplicant } from '../../browser_shared/replicants.ts';
    import { computed } from 'vue';

    const categories = computed(() => quizBingoReplicant?.data?.categories);
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

    .Categories {
        width: 120px;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 28px;
        color: var(--font-color);
    }

    #CategoryContainer {
        position: absolute;
        top: 0px;
        left: 610px;
        display: flex;
    }

    #Bingo-board {
        position: absolute;
        top: 200px;
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
