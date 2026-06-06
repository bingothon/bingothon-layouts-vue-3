<template>
    <div id="GameLayout">
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
            :name-width-px="120"
            :max-user-count="5"
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
        width: 780px;
        height: 440px;
        border: 2px var(--container-border-color) solid;
        background-color: aqua;
    }

    #stream2 {
        position: absolute;
        top: 60px;
        left: 1140px;
        width: 780px;
        height: 440px;
        border: 2px var(--container-border-color) solid;
        background-color: blue;
    }

    #stream3 {
        position: absolute;
        top: 500px;
        left: 0px;
        width: 780px;
        height: 440px;
        border: 2px var(--container-border-color) solid;
        background-color: red;
    }

    #discord-voice {
        position: absolute;
        top: 750px;
        left: 780px;
        width: 360px;
        height: 250px;
        border: 2px var(--container-border-color) solid;
    }

    #pi1 {
        position: absolute;
        top: 0px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 780px;
    }

    #pi2 {
        position: absolute;
        top: 0px;
        left: 1140px;
        border: 2px var(--container-border-color) solid;
        width: 780px;
    }

    #pi3 {
        position: absolute;
        top: 940px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 780px;
    }

    #Bingo-board {
        position: absolute;
        top: 500px;
        left: 1140px;
        border: 2px var(--container-border-color) solid;
        width: 780px;
        height: 500px;
    }

    #game {
        position: absolute;
        top: 0px;
        left: 780px;
        width: 360px;
        border: 2px var(--container-border-color) solid;
        height: 300px;
    }

    #timer {
        position: absolute;
        top: 500px;
        left: 780px;
        width: 360px;
        border: 2px var(--container-border-color) solid;
        height: 250px;
    }

    #SponsorContainer {
        position: absolute;
        top: 300px;
        left: 780px;
        width: 360px;
        height: 200px;
        border: 2px var(--container-border-color) solid;
    }
</style>
