<template>
    <div class="q-mb-sm">
        <QChip
            :icon="isRunning ? 'play_arrow' : 'pause'"
            square
            @click="toggleTimer"
            >{{ currentTime }}</QChip
        >
        <QBtn
            color="black"
            :icon="isRunning ? 'pause' : 'play_arrow'"
            size="sm"
            square
            dense
            @click="toggleTimer"
        ></QBtn>
    </div>
    <QInput
        v-model="newTimerValue"
        class="q-mb-sm"
        outlined
        dark
        dense
        label="Time (MM:SS)"
    />
    <QBtn
        color="black"
        square
        @click="setTimer"
        >Set</QBtn
    >
</template>
<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { countdownTimerReplicant, thisBundle } from '../../browser_shared/replicants';
    const currentTime = computed(() => countdownTimerReplicant?.data?.time);
    const isRunning = computed(() => countdownTimerReplicant?.data?.state === 'running');
    const newTimerValue = ref('10:00');

    function setTimer() {
        const match = newTimerValue.value.match(/^((?<hours>\d+):)?(?<minutes>\d{1,2}):(?<seconds>\d{1,2})$/);
        if (match) {
            console.log(match.groups);
            const seconds =
                parseInt(match.groups?.['hours'] || '0') * 3600 +
                parseInt(match.groups?.['minutes'] || '0') * 60 +
                parseInt(match.groups?.['seconds'] || '0');
            nodecg.sendMessageToBundle('countdownTimer:setTime', thisBundle, seconds);
        }
    }

    function toggleTimer() {
        if (isRunning.value) {
            nodecg.sendMessageToBundle('countdownTimer:stop', thisBundle);
        } else {
            nodecg.sendMessageToBundle('countdownTimer:start', thisBundle);
        }
    }
</script>

<style scoped></style>
