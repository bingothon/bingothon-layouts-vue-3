<template>
    <div>
        <PlayerInfo
            id="pi1"
            class="PlayerInfo"
            :player-index="0"
            :height-px="60"
        ></PlayerInfo>
        <PlayerInfo
            id="pi2"
            class="PlayerInfo"
            :player-index="1"
            :height-px="60"
            :reverse-order="true"
        ></PlayerInfo>
        <PlayerInfo
            id="pi3"
            class="PlayerInfo"
            :player-index="2"
            :height-px="60"
        ></PlayerInfo>
        <GameInfoContainer id="game"></GameInfoContainer>
        <TimerContainer id="timer"></TimerContainer>
        <BingoBoard
            id="Bingo-board"
            font-size="30px"
        ></BingoBoard>
        <DiscordDisplay
            id="discord-voice"
            :icon-height-px="40"
            :name-width-px="200"
            :max-user-count="8"
            voice-highlight-color="var(--discord-voice-highlight-color)"
        ></DiscordDisplay>
        <SponsorLogoRotation
            id="SponsorContainer"
            :logo-asset-type="LogoAssetType.wideSmallLogos"
        ></SponsorLogoRotation>
        <twitch-player
            id="stream1"
            :stream-index="0"
        ></twitch-player>
        <twitch-player
            id="stream2"
            :stream-index="1"
        ></twitch-player>
        <twitch-player
            id="stream3"
            :stream-index="2"
        ></twitch-player>
        <div id="border1"></div>
        <div id="border2"></div>
        <div id="border3"></div>
    </div>
</template>

<script setup lang="ts">
    import BingoBoard from '../../components/bingoboard/bingoBoard.vue';
    import DiscordDisplay from '../../components/discordDisplay.vue';
    import GameInfoContainer from '../../components/gameInfo/gameInfoContainer.vue';
    import PlayerInfo from '../../components/runnerInfo/playerInfo.vue';
    import SponsorLogoRotation, { LogoAssetType } from '../../components/sponsorLogoRotation.vue';
    import TimerContainer from '../../components/timerContainer.vue';
    import TwitchPlayer from '../../components/twitchStreamPlaceholder.vue';
</script>

<style scoped>
    #stream1 {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 667px;
        height: 500px;
        border: 2px var(--container-border-color) solid;
        background-color: aqua;
    }

    #stream2 {
        position: absolute;
        top: 0px;
        left: 1253px;
        width: 667px;
        height: 500px;
        border: 2px var(--container-border-color) solid;
        background-color: blue;
    }

    #stream3 {
        position: absolute;
        top: 500px;
        left: 0px;
        width: 667px;
        height: 500px;
        border: 2px var(--container-border-color) solid;
        background-color: red;
    }

    #discord-voice {
        position: absolute;
        top: 690px;
        left: 667px;
        width: 586px;
        height: 250px;
        border: 2px var(--container-border-color) solid;
        border-bottom: none;
    }

    #pi1 {
        position: absolute;
        top: 0px;
        left: 665px;
        border: 2px var(--container-border-color) solid;
        width: 566px;
    }

    #border1 {
        position: absolute;
        top: 0px;
        left: 1231px;
        border: 2px var(--container-border-color) solid;
        border-bottom: none;
        border-left: none;
        height: 60px;
        width: 20px;
    }

    #pi2 {
        position: absolute;
        top: 440px;
        left: 689px;
        border: 2px var(--container-border-color) solid;
        width: 566px;
    }

    #border2 {
        position: absolute;
        top: 438px;
        left: 667px;
        border: 2px var(--container-border-color) solid;
        border-top: none;
        border-right: none;
        height: 60px;
        width: 20px;
    }

    #pi3 {
        position: absolute;
        top: 940px;
        left: 665px;
        border: 2px var(--container-border-color) solid;
        width: 566px;
    }

    #border3 {
        position: absolute;
        top: 938px;
        left: 1231px;
        border: 2px var(--container-border-color) solid;
        border-top: none;
        border-left: none;
        height: 60px;
        width: 20px;
    }

    #Bingo-board {
        position: absolute;
        top: 500px;
        left: 1253px;
        border: 2px var(--container-border-color) solid;
        width: 667px;
        height: 500px;
    }

    #game {
        position: absolute;
        top: 60px;
        left: 667px;
        width: 586px;
        border: 2px var(--container-border-color) solid;
        height: 180px;
        border-top: none;
    }

    #timer {
        position: absolute;
        top: 500px;
        left: 667px;
        width: 586px;
        border: 2px var(--container-border-color) solid;
        height: 190px;
    }

    #SponsorContainer {
        position: absolute;
        top: 240px;
        left: 667px;
        width: 586px;
        height: 200px;
        border: 2px var(--container-border-color) solid;
        border-bottom: none;
    }
</style>
