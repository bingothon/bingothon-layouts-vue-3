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
            <div>
                {{ question.question }}
            </div>
            <div>
                {{ question.answer }}
            </div>
            <div>
                <QBtn
                    dark
                    color="black"
                    small
                    @click="markP0()"
                    >Mark {{ players[0].name }}</QBtn
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
                    >Mark {{ players[1].name }}</QBtn
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

    const selected = computed(() => quizBingoReplicant?.data?.currentlySelected);
    const question = computed(() =>
        selected.value ? quizBingoReplicant?.data?.questions?.[selected.value?.column][selected.value?.row] : undefined
    );

    function unselect(): void {
        nodecg.sendMessageToBundle('quiz:deselect', thisBundle);
    }

    function markP0() {
        nodecg.sendMessageToBundle('quiz:mark', thisBundle, 0);
    }

    function markP1() {
        nodecg.sendMessageToBundle('quiz:mark', thisBundle, 1);
    }

    function unmark() {
        nodecg.sendMessageToBundle('quiz:mark', thisBundle, null);
    }

    function revealAnswer() {
        nodecg.sendMessageToBundle('quiz:setStage', thisBundle, 'answer');
    }
</script>

<style scoped></style>
