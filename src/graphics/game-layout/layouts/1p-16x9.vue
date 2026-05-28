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
                height="60px"
                :hide-sound-icon="true"
            ></PlayerInfo>
        </div>
        <GameInfoContainer id="game"></GameInfoContainer>
        <TimerContainer id="timer"></TimerContainer>
        <BingoBoard
            id="Bingo-board"
            font-size="30px"
        ></BingoBoard>
        <DiscordDisplay
            id="discord-voice"
            :style="{ top: `${500 + 60 * players.length}px`, height: `${325 - 60 * players.length}px` }"
            :icon-height-px="40"
            :name-width-px="114"
            :max-user-count="8"
            voice-highlight-color="red"
        ></DiscordDisplay>
        <div id="SponsorContainer">
            <SponsorLogoRotation :logo-asset-type="LogoAssetType.wideLargeLogos"></SponsorLogoRotation>
        </div>
        <twitch-player
            id="stream1"
            stream-index="0"
        ></twitch-player>
    </div>
</template>

<script setup lang="ts">
    import PlayerInfo from '../../components/playerInfo/playerInfo.vue';
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

    #discord-voice {
        position: absolute;
        left: 0px;
        width: 448px;
        border: 2px var(--container-border-color) solid;
    }

    .PlayerInfo {
        position: absolute;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 448px;
        box-sizing: border-box;
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

    #Bingo-board {
        position: absolute;
        top: v-bind('`${60 * players.length}px`');
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 448px;
        height: 500px;
    }

    #game {
        position: absolute;
        top: 828px;
        left: 448px;
        width: 750px;
        border: 2px var(--container-border-color) solid;
        height: 172px;
    }

    #timer {
        position: absolute;
        top: 828px;
        left: 1198px;
        width: 720px;
        border: 2px var(--container-border-color) solid;
        height: 172px;
    }

    #stream1 {
        position: absolute;
        top: 0px;
        left: 450px;
        width: 1471px;
        height: 828px;
        background-color: aqua;
    }

    #SponsorContainer {
        position: absolute;
        top: 828px;
        left: 0px;
        width: 448px;
        border: 2px var(--container-border-color) solid;
        height: 172px;
    }
</style>
