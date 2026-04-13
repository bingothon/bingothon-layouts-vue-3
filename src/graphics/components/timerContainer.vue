<template>
    <div class="TimerContainer RunInfoBox FlexContainer">
        <div
            class="TimerBox RunInfoBox FlexContainer"
            :class="timerStateClass"
        >
            <template
                v-for="(char, i) in timeChars"
                :key="i"
            >
                <span v-if="char.trim()">{{ char }}</span>
            </template>
        </div>
        <div class="EstimateBox FlexContainer">Est: {{ estimate }}</div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch, type Ref } from 'vue';
    import { runDataActiveRunReplicant, timerReplicant } from '../../browser_shared/replicants';

    const backupTimerTO: Ref<number | undefined> = ref(undefined);
    const timeString: Ref<string> = ref('00:00:00');

    watch(
        () => timerReplicant?.data,
        () => {
            if (timerReplicant?.data?.time) {
                timeString.value = timerReplicant.data.time;
            }
            clearTimeout(backupTimerTO.value);
            backupTimerTO.value = window.setTimeout(() => backupTimer(), 1000);
        }
    );

    const estimate = computed<string>(() => runDataActiveRunReplicant?.data?.estimate ?? 'N/A');
    const timerStateClass = computed<string>(() => timerReplicant?.data?.state || 'running');
    const timeChars = computed<string[]>(() => timeString.value.split(''));

    /**
     * Backup timer that takes over if the connection to the server is lost.
     * Based on the last timestamp that was received.
     * When the connection is restored, the server timer will recover and take over again.
     */
    function backupTimer(): void {
        backupTimerTO.value = window.setTimeout(() => backupTimer(), 200);

        if (timerReplicant?.data?.state === 'running') {
            const missedTime = Date.now() - timerReplicant.data.timestamp;
            const timeOffset = timerReplicant.data.milliseconds + missedTime;
            timeString.value = msToTimeStr(timeOffset);
        }
    }

    function msToTimeStr(ms: number): string {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
        const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }
</script>

<style scoped>
    .TimerContainer {
        flex-direction: column;
        color: white;
    }

    .TimerBox {
        font-weight: 500;
        font-size: 75px;
        transition: 1s;
        align-content: center;
        text-align: center;
    }

    /* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
    .TimerBox :deep(span) {
        display: inline-block;
        width: 0.6em;
        margin: 0.01em;
        text-align: center;
        font-weight: bold;
    }

    .TimerBox :deep(span:nth-of-type(3)),
    .TimerBox :deep(span:nth-of-type(6)) {
        width: 0.22em;
        margin-top: -0.15em; /* Make the colon appear more towards the centre. */
    }

    .TimerBox.running {
        color: white;
    }

    .TimerBox.paused,
    .TimerBox.stopped {
        color: gray;
    }

    .TimerBox.finished {
        color: blue;
    }

    .EstimateBox {
        font-size: 30px;
    }
</style>
