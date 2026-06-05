<template>
    <div id="GameLayout">
        <PlayerInfo
            id="pi1"
            class="PlayerInfo"
            :player-index="0"
            :height-px="60"
            :style="{ border: isTeamRun ? `5px ${teamColor1} solid` : '2px var(--container-border-color) solid' }"
        ></PlayerInfo>
        <PlayerInfo
            id="pi2"
            class="PlayerInfo"
            :player-index="1"
            :height-px="60"
            :style="{ border: isTeamRun ? `5px ${teamColor1} solid` : '2px var(--container-border-color) solid' }"
        ></PlayerInfo>
        <PlayerInfo
            id="pi3"
            class="PlayerInfo"
            :player-index="2"
            :height-px="60"
            :style="{ border: isTeamRun ? `5px ${teamColor2} solid` : '2px var(--container-border-color) solid' }"
        ></PlayerInfo>
        <PlayerInfo
            id="pi4"
            class="PlayerInfo"
            :player-index="3"
            :height-px="60"
            :style="{ border: isTeamRun ? `5px ${teamColor2} solid` : '2px var(--container-border-color) solid' }"
        ></PlayerInfo>
        <TeamInfo
            v-if="isTeamRun"
            id="ti1"
            :team-index="0"
            :height-px="60"
            :style="{ border: `5px ${teamColor1} solid` }"
        ></TeamInfo>
        <TeamInfo
            v-if="isTeamRun"
            id="ti2"
            :team-index="1"
            :height-px="60"
            :style="{ border: `5px ${teamColor2} solid` }"
        ></TeamInfo>
        <GameInfoContainer id="game"></GameInfoContainer>
        <TimerContainer id="timer"></TimerContainer>
        <BingoBoard
            id="Bingo-board"
            font-size="30px"
            :style="{ top: isTeamRun ? '530px' : '500px', height: isTeamRun ? '470px' : '500px' }"
        ></BingoBoard>
        <DiscordDisplay
            id="discord-voice"
            :icon-height-px="40"
            :name-width-px="120"
            :max-user-count="3"
            voice-highlight-color="var(--discord-voice-highlight-color)"
        ></DiscordDisplay>
        <SponsorLogoRotation
            id="SponsorContainer"
            :logo-asset-type="LogoAssetType.wideSmallLogos"
            :style="{ height: isTeamRun ? '170px' : '200px' }"
        ></SponsorLogoRotation>
        <twitch-player
            id="stream1"
            stream-index="0"
            :style="{ border: isTeamRun ? `2px ${teamColor1} solid` : '2px var(--container-border-color) solid' }"
        ></twitch-player>
        <twitch-player
            id="stream2"
            stream-index="1"
            :style="{ border: isTeamRun ? `2px ${teamColor1} solid` : '2px var(--container-border-color) solid' }"
        ></twitch-player>
        <twitch-player
            id="stream3"
            stream-index="2"
            :style="{ border: isTeamRun ? `2px ${teamColor2} solid` : '2px var(--container-border-color) solid' }"
        ></twitch-player>
        <twitch-player
            id="stream4"
            stream-index="3"
            :style="{ border: isTeamRun ? `2px ${teamColor2} solid` : '2px var(--container-border-color) solid' }"
        ></twitch-player>
    </div>
</template>

<script setup lang="ts">
    import DiscordDisplay from '../../components/discordDisplay.vue';
    import TwitchPlayer from '../../components/twitchStreamPlaceholder.vue';
    import GameInfoContainer from '../../components/gameInfo/gameInfoContainer.vue';
    import SponsorLogoRotation, { LogoAssetType } from '../../components/sponsorLogoRotation.vue';
    import TimerContainer from '../../components/timerContainer.vue';
    import PlayerInfo from '../../components/runnerInfo/playerInfo.vue';
    import BingoBoard from '../../components/bingoboard/bingoBoard.vue';
    import TeamInfo from '../../components/runnerInfo/teamInfo.vue';
    import { isTeamRun, teamColor1, teamColor2 } from './common.ts';
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

    #stream1 {
        position: absolute;
        top: 60px;
        left: 0px;
        width: 585px;
        height: 440px;
        background-color: aqua;
    }

    #stream2 {
        position: absolute;
        top: 500px;
        left: 0px;
        width: 585px;
        height: 440px;
        background-color: blue;
    }

    #stream3 {
        position: absolute;
        top: 60px;
        left: 1335px;
        width: 585px;
        height: 440px;
        background-color: red;
    }

    #stream4 {
        position: absolute;
        top: 500px;
        left: 1335px;
        width: 585px;
        height: 440px;
        background-color: orange;
    }

    #ti1 {
        position: absolute;
        top: 470px;
        left: 585px;
        width: 375px;
        background-image: linear-gradient(var(--lighter-main-color), var(--darker-main-color));
    }

    #ti2 {
        position: absolute;
        top: 470px;
        left: 960px;
        width: 375px;
        background-image: linear-gradient(var(--lighter-main-color), var(--darker-main-color));
    }

    #pi1 {
        left: 0px;
        top: 0px;
    }

    #pi2 {
        top: 940px;
        left: 0px;
    }

    #pi3 {
        left: 1335px;
        top: 0px;
    }

    #pi4 {
        left: 1335px;
        top: 940px;
    }

    .PlayerInfo {
        position: absolute;
        width: 585px;
    }

    #Bingo-board {
        position: absolute;
        left: 585px;
        width: 750px;
    }

    #game {
        position: absolute;
        top: 0px;
        left: 585px;
        width: 450px;
        border: 2px var(--container-border-color) solid;
        height: 155px;
    }

    #timer {
        position: absolute;
        top: 155px;
        left: 585px;
        width: 450px;
        border: 2px var(--container-border-color) solid;
        height: 145px;
    }

    #discord-voice {
        position: absolute;
        top: 0px;
        left: 1035px;
        width: 300px;
        height: 300px;
        border: 2px var(--container-border-color) solid;
    }

    #SponsorContainer {
        position: absolute;
        top: 300px;
        left: 585px;
        width: 750px;
        border: 2px var(--container-border-color) solid;
    }
</style>
