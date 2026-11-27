<template>
    <div>
        <QBtn
            dark
            color="black"
            small
            @click="unselect"
            >Back to Full View</QBtn
        >
        <div v-if="!question">
            <div>No cell selected</div>
        </div>
        <div v-else>
            <div style="white-space: pre-line">Q: {{ question.question }}</div>
            <br />
            <div style="white-space: pre-line">A: {{ question.answer }}</div>
            <div v-if="buzzedPlayer != undefined && timerLeftMs > 0">
                Buzzer {{ players[buzzedPlayer].name }}: {{ timerLeftMs / 1000 }}s left
            </div>
            <div>
                <QBtn
                    dark
                    color="black"
                    small
                    @click="markP0()"
                    >Mark {{ players[0]?.name ?? 'Player 0' }}</QBtn
                >
                <QBtn
                    dark
                    color="black"
                    small
                    @click="unmark()"
                    >Unmark</QBtn
                >
                <QBtn
                    dark
                    color="black"
                    small
                    @click="markP1()"
                    >Mark {{ players[1]?.name ?? 'Player 1' }}</QBtn
                >
                <QBtn
                    dark
                    color="black"
                    small
                    @click="markVoid"
                    >Mark Void</QBtn
                >
            </div>
            <QBtn
                dark
                color="black"
                small
                @click="revealAnswer()"
                >Reveal Answer</QBtn
            >
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { quizBingoReplicant, thisBundle } from '../../../browser_shared/replicants.ts';
    import { players } from '../../../graphics/game-layout/layouts/common.ts';
    import { buzzedPlayer, useBuzzerCountdown } from '../../../browser_shared/quiz.ts';

    const props = defineProps<{ selected: { row: number; column: number } }>();
    const question = computed(() => quizBingoReplicant?.data?.questions?.[props.selected.column][props.selected.row]);
    const { timerLeftMs } = useBuzzerCountdown();

    function unselect(): void {
        nodecg.sendMessageToBundle('quiz:deselect', thisBundle);
    }

    function markP0() {
        nodecg.sendMessageToBundle('quiz:mark', thisBundle, 0);
    }

    function markP1() {
        nodecg.sendMessageToBundle('quiz:mark', thisBundle, 1);
    }

    function markVoid() {
        nodecg.sendMessageToBundle('quiz:mark', thisBundle, 2);
    }

    function unmark() {
        nodecg.sendMessageToBundle('quiz:mark', thisBundle, null);
    }

    function revealAnswer() {
        nodecg.sendMessageToBundle('quiz:setStage', thisBundle, 'answer');
    }
</script>

<style scoped></style>
