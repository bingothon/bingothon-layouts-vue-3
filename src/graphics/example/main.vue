<script setup lang="ts">
    import { useHead } from '@unhead/vue';
    import { ref } from 'vue';
    import { exampleReplicant } from '../../browser_shared/replicants';
    import type { ExampleType } from '../../types';
    import DiscordDisplay from '../components/discordDisplay.vue';

    useHead({ title: 'example' }); // set the title of this page
    const text = ref('Example');

    // Example code: accessing normal types.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exampleType: ExampleType = { exampleProperty: 'exampleString' };
</script>

<template>
    <div>
        {{ text }}
        <br><br>
        <img src="./image.png">
        <br><br>
        <!-- Example code: accessing a replicant. -->
        {{ exampleReplicant?.data?.exampleProperty }}
        <DiscordDisplay
            :icon-height-px="50"
            :name-width-px="100"
            voice-highlight-color="rgba(255, 0, 0, 0.5)"
        />
    </div>
</template>
