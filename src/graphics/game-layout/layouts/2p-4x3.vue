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
            :max-user-count="6"
            voice-highlight-color="var(--discord-voice-highlight-color)"
        ></DiscordDisplay>
        <SponsorLogoRotation
            id="SponsorContainer"
            :logo-asset-type="LogoAssetType.squareLogos"
        ></SponsorLogoRotation>

        <twitch-player
            id="stream1"
            :stream-index="0"
        ></twitch-player>
        <twitch-player
            id="stream2"
            :stream-index="1"
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
        width: 820px;
        height: 615px;
        border: 2px var(--container-border-color) solid;
        background-color: aqua;
    }

    #stream2 {
        position: absolute;
        top: 0px;
        left: 1100px;
        width: 820px;
        height: 615px;
        border: 2px var(--container-border-color) solid;
        background-color: blue;
    }

    #discord-voice {
        position: absolute;
        top: 0px;
        left: 820px;
        width: 280px;
        height: 335px;
        border: 2px var(--container-border-color) solid;
    }

    #pi1 {
        position: absolute;
        top: 615px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 643px;
        box-sizing: border-box;
    }

    #pi2 {
        position: absolute;
        top: 615px;
        left: 1280px;
        border: 2px var(--container-border-color) solid;
        width: 643px;
        box-sizing: border-box;
    }

    #Bingo-board {
        position: absolute;
        top: 615px;
        left: 640px;
        border: 2px var(--container-border-color) solid;
        width: 640px;
        height: 385px;
    }

    #game {
        position: absolute;
        top: 675px;
        left: 0px;
        width: 643px;
        border: 2px var(--container-border-color) solid;
        height: 325px;
    }

    #SponsorContainer {
        position: absolute;
        top: 335px;
        left: 820px;
        width: 280px;
        border: 2px var(--container-border-color) solid;
        height: 280px;
    }

    #timer {
        position: absolute;
        top: 675px;
        left: 1280px;
        width: 643px;
        border: 2px var(--container-border-color) solid;
        height: 325px;
    }
</style>
