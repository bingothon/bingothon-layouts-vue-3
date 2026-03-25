<script setup lang="ts">
    import { useHead } from '@unhead/vue';
import { ref } from 'vue';
import { exampleReplicant } from '../../browser_shared/replicants';
import type { ExampleType } from '../../types';
import DiscordDisplay from '../components/discordDisplay.vue';
import CellTextFit from '../components/helpers/cellTextFit.vue';

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
        <DiscordDisplay
            :icon-height-px="50"
            :name-width-px="100"
            voice-highlight-color="rgba(255, 0, 0, 0.5)"
        />
        <CellTextFit id="ctf" :text="randomText" font-size="20px" />
    </div>
</template>

<style scoped>
    .DiscordVoiceDisplay {
        position: absolute;
        top: 200px;
        left: 20px;
        width: 350px;
    }

    #ctf {
        position: relative;
        left: 500px;
        height: 50px;
        width: 50px;
    }

    #ctf {
        position: relative;
        left: 500px;
        height: 50px;
        width: 50px;
    }
</style>
