<template>
    <div id="GameLayout">
        <div
            v-for="(_player, i) in players"
            :key="i"
        >
            <PlayerInfo
                :id="`pi${i + 1}`"
                class="PlayerInfo"
                :class="i === 0 ? 'First' : i === players.length - 1 ? 'Last' : 'Middle'"
                :style="{ top: `${60 * i}px` }"
                :player-index="i"
                :height-px="60"
                :hide-sound-icon="true"
            ></PlayerInfo>
        </div>
        <GameInfoContainer
            id="game"
            :style="{ top: `${60 * players.length}px`, height: `${360 - 60 * players.length}px` }"
        ></GameInfoContainer>
        <TimerContainer id="timer"></TimerContainer>
        <BingoBoard
            id="Bingo-board"
            font-size="30px"
        ></BingoBoard>
        <DiscordDisplay
            id="discord-voice"
            :icon-height-px="40"
            :name-width-px="120"
            :max-user-count="8"
            voice-highlight-color="var(--discord-voice-highlight-color)"
        ></DiscordDisplay>
        <SponsorLogoRotation
            id="SponsorContainer"
            :logo-asset-type="LogoAssetType.wideLargeLogos"
        ></SponsorLogoRotation>
        <twitch-player
            id="stream1"
            :stream-index="0"
        ></twitch-player>
    </div>
</template>

<script setup lang="ts">
    import PlayerInfo from '../../components/runnerInfo/playerInfo.vue';
    import GameInfoContainer from '../../components/gameInfo/gameInfoContainer.vue';
    import BingoBoard from '../../components/bingoboard/bingoBoard.vue';
    import TwitchPlayer from '../../components/twitchStreamPlaceholder.vue';
    import SponsorLogoRotation, { LogoAssetType } from '../../components/sponsorLogoRotation.vue';
    import TimerContainer from '../../components/timerContainer.vue';
    import DiscordDisplay from '../../components/discordDisplay.vue';
    import { players } from './common.ts';
</script>

<style scoped>
    #GameLayout {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 1920px;
        height: 1080px;
        background: linear-gradient(-128deg, var(--gradient-light) 0, var(--gradient-dark) 100%) 100% no-repeat fixed;
    }

    .PlayerInfo {
        position: absolute;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 810px;
    }

    .PlayerInfo.First {
        border-bottom-width: 1px;
    }

    .PlayerInfo.Last {
        border-top-width: 1px;
    }

    .PlayerInfo.Middle {
        border-top-width: 1px;
        border-bottom-width: 1px;
    }

    #stream1 {
        position: absolute;
        top: 0px;
        left: 810px;
        width: 1110px;
        height: 1000px;
        border: 2px var(--container-border-color) solid;
        background-color: aqua;
    }

    #SponsorContainer {
        position: absolute;
        top: 460px;
        left: 325px;
        width: 485px;
        height: 150px;
        border: 2px var(--container-border-color) solid;
    }

    #Bingo-board {
        position: absolute;
        top: 610px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 810px;
        height: 390px;
    }

    #game {
        position: absolute;
        left: 0px;
        width: 810px;
        border: 2px var(--container-border-color) solid;
    }

    #timer {
        position: absolute;
        top: 460px;
        left: 0px;
        width: 325px;
        border: 2px var(--container-border-color) solid;
        height: 150px;
    }

    #discord-voice {
        position: absolute;
        left: 0px;
        width: 810px;
        border: 2px var(--container-border-color) solid;
        height: 100px;
        top: 360px;
    }
</style>
