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
            :max-user-count="9"
            voice-highlight-color="red"
        ></DiscordDisplay>
        <SponsorLogoRotation
            id="SponsorContainer"
            :logo-asset-type="LogoAssetType.wideSmallLogos"
        ></SponsorLogoRotation>

        <twitch-player
            id="stream1"
            stream-index="0"
        ></twitch-player>
        <twitch-player
            id="stream2"
            stream-index="1"
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
        top: 0px;
        left: 0px;
        width: 960px;
        height: 540px;
        border: 2px var(--container-border-color) solid;
        background-color: aqua;
    }

    #stream2 {
        position: absolute;
        top: 0px;
        left: 960px;
        width: 960px;
        height: 540px;
        border: 2px var(--container-border-color) solid;
        background-color: blue;
    }

    #discord-voice {
        position: absolute;
        top: 600px;
        left: 1280px;
        width: 640px;
        height: 200px;
        border: 2px var(--container-border-color) solid;
    }

    #pi1 {
        position: absolute;
        top: 540px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 640px;
    }

    #pi2 {
        position: absolute;
        top: 540px;
        left: 1280px;
        border: 2px var(--container-border-color) solid;
        width: 640px;
    }

    #Bingo-board {
        position: absolute;
        top: 540px;
        left: 640px;
        border: 2px var(--container-border-color) solid;
        width: 640px;
        height: 460px;
    }

    #game {
        position: absolute;
        top: 800px;
        left: 0px;
        width: 640px;
        border: 2px var(--container-border-color) solid;
        height: 200px;
    }

    #timer {
        position: absolute;
        top: 800px;
        left: 1280px;
        width: 640px;
        border: 2px var(--container-border-color) solid;
        height: 200px;
    }

    #SponsorContainer {
        position: absolute;
        top: 600px;
        left: 0px;
        width: 640px;
        border: 2px var(--container-border-color) solid;
        height: 200px;
    }
</style>
