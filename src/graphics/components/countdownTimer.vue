<template>
    <div class="CountdownContainer FlexContainer">
        <div class="CountdownTimer FlexContainer">
            <template
                v-for="(char, i) in timerChars"
                :key="i"
            >
                <span
                    v-if="char.trim()"
                    :class="{ isColon: char === ':' }"
                    >{{ char }}</span
                >
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import { countdownTimerReplicant } from '../../browser_shared/replicants';

    const timerChars = computed(() => countdownTimerReplicant?.data?.time.split(''));
</script>

<style>
    .CountdownContainer {
        flex-direction: column;
        color: white;
    }
    .CountdownTimer {
        font-weight: 500;
        font-size: 100px;
        transition: 1s;
        align-content: center;
        text-align: center;
    }

    /* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
    .CountdownTimer span {
        display: inline-block;
        width: 0.6em;
        margin: 0.01em;
        text-align: center;
        font-weight: bold;
    }

    .CountdownTimer span.isColon {
        width: 0.22em;
        margin-top: -0.15em; /* Make the colon appear more towards the centre. */
    }
</style>
