<script setup lang="ts">
    import { useHead } from '@unhead/vue';
    import { ref } from 'vue';
    import { exampleReplicant } from '../../browser_shared/replicants';
    import type { ExampleType } from '../../types';
    import Bingoboard from '../components/bingoboard/bingoBoard.vue';
    import DiscordDisplay from '../components/discordDisplay.vue';
    import GameInfoContainer from '../components/gameInfo/gameInfoContainer.vue';
    import CellTextFit from '../components/helpers/cellTextFit.vue';
    import PlayerInfo from '../components/playerInfo/playerInfo.vue';
    import SponsorLogoRotation, { LogoAssetType } from '../components/sponsorLogoRotation.vue';
    import TimerContainer from '../components/timerContainer.vue';

    useHead({ title: 'example' }); // set the title of this page
    const text = ref('Example');

    const randomText = ref('text');

    function getRandomString(length: number) {
        return String.fromCharCode(
            ...Array(length)
                .fill(0)
                .map(() => 97 + Math.floor(Math.random() * 26))
        );
    }

    function getRandomText() {
        return Array(Math.floor(Math.random() * 6) + 1)
            .fill(0)
            .map(() => getRandomString(Math.floor(Math.random() * 5) + 5))
            .join(' ');
    }

    setInterval(() => {
        randomText.value = getRandomText();
    }, 6000);

    // Example code: accessing normal types.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exampleType: ExampleType = { exampleProperty: 'exampleString' };
</script>

<template>
    <div>
        {{ text }}
        <br />
        <br />
        <img src="./image.png" />
        <br />
        <br />
        <!-- Example code: accessing a replicant. -->
        {{ exampleReplicant?.data?.exampleProperty }}
        <PlayerInfo
            id="pi1"
            :player-index="0"
            height="45px"
        />
        <PlayerInfo
            id="pi2"
            :player-index="1"
            height="45px"
        />
        <PlayerInfo
            id="pi3"
            :player-index="2"
            height="45px"
        />
        <PlayerInfo
            id="pi4"
            :player-index="3"
            height="45px"
        />
        <DiscordDisplay
            :icon-height-px="50"
            :name-width-px="100"
            voice-highlight-color="rgba(255, 0, 0, 0.5)"
        />
        <TimerContainer id="timer" />
        <GameInfoContainer id="game" />
        <CellTextFit
            id="ctf"
            :text="randomText"
            font-size="20px"
        />
        <Bingoboard
            id="bboard"
            font-size="20px"
        />
        <SponsorLogoRotation
            id="sponsor"
            :logo-asset-type="LogoAssetType.squareLogos"
        />
    </div>
</template>

<style scoped>
    .DiscordVoiceDisplay {
        position: absolute;
        top: 200px;
        left: 20px;
        width: 350px;
    }

    #timer {
        position: absolute;
        top: 20px;
        left: 20px;
        background-color: brown;
    }

    #game {
        position: absolute;
        top: 200px;
        left: 200px;
        height: 100px;
        background-color: darkblue;
    }

    #ctf {
        position: relative;
        left: 500px;
        height: 50px;
        width: 50px;
    }

    #bboard {
        position: relative;
        left: 500px;
        height: 700px;
        width: 700px;
    }

    #sponsor {
        position: absolute;
        top: 0;
        left: 789px;
        height: 400px;
        width: 400px;
    }
</style>
