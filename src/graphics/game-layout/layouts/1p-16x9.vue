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
        <GameInfoContainer id="game"></GameInfoContainer>
        <TimerContainer id="timer"></TimerContainer>
        <BingoBoard
            id="Bingo-board"
            font-size="30px"
            :style="{ top: `${60 * players.length}px` }"
        ></BingoBoard>
        <DiscordDisplay
            id="discord-voice"
            :style="{ top: `${500 + 60 * players.length}px`, height: `${332 - 60 * players.length}px` }"
            :icon-height-px="40"
            :name-width-px="120"
            :max-user-count="maxDiscordMembers"
            voice-highlight-color="red"
        ></DiscordDisplay>
        <SponsorLogoRotation
            id="SponsorContainer"
            :logo-asset-type="LogoAssetType.wideLargeLogos"
        ></SponsorLogoRotation>
        <twitch-player
            id="stream1"
            stream-index="0"
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
    import { computed } from 'vue';

    const maxDiscordMembers = computed<number>(() => {
        switch (players.value.length) {
            case 1:
                return 8;
            case 2:
                return 6;
            case 3:
                return 4;
            case 4:
            default:
                return 2;
        }
    });
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
        width: 450px;
        border: 2px var(--container-border-color) solid;
    }

    .PlayerInfo {
        position: absolute;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 450px;
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
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 450px;
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
        left: 1196px;
        width: 724px;
        border: 2px var(--container-border-color) solid;
        height: 172px;
    }

    #stream1 {
        position: absolute;
        top: 0px;
        left: 450px;
        width: 1470px;
        height: 830px;
        background-color: aqua;
    }

    #SponsorContainer {
        position: absolute;
        top: 830px;
        left: 0px;
        width: 450px;
        border: 2px var(--container-border-color) solid;
        height: 170px;
    }
</style>
