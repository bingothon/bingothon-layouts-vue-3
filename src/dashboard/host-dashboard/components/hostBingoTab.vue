<template>
    <div class="grid-container">
        <div class="grid-col">
            <div class="board-wrapper">
                <HostBingoBoard
                    ref="boardComponent"
                    :font-size="fontSize"
                    :is-restream="isRestream"
                />
            </div>
        </div>

        <div class="grid-col control-panel">
            <QBtn
                color="negative"
                icon="delete"
                label="Reset Board"
                @click="showResetDialog = true"
            />
            <div class="legend-entry red-legend">Red = Bingothon</div>
            <div class="legend-entry blue-legend">Blue = Nitro (Restream, left click)</div>
        </div>
        <QDialog
            v-model="showResetDialog"
            persistent
            seamless
        >
            <QCard style="min-width: 350px">
                <QCardSection class="row items-center">
                    <QAvatar
                        icon="warning"
                        color="negative"
                        text-color="white"
                    />
                    <span class="q-ml-sm text-weight-bold text-h6">Reset Bingo Board?</span>
                </QCardSection>

                <QCardSection class="q-pt-none">
                    Are you sure you want to clear the entire board? This action cannot be undone.
                </QCardSection>

                <QCardActions
                    align="right"
                    class="text-primary"
                >
                    <QBtn
                        v-close-popup
                        flat
                        label="Cancel"
                        color="grey-7"
                    />
                    <QBtn
                        v-close-popup
                        flat
                        label="Yes, Reset"
                        color="negative"
                        @click="resetBoard"
                    />
                </QCardActions>
            </QCard>
        </QDialog>
    </div>
</template>
<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import HostBingoBoard from '../../../graphics/components/bingoboard/hostBingoBoard.vue';

    interface HostBingoBoardInstance {
        resetBoard: () => void;
    }

    withDefaults(
        defineProps<{
            fontSize?: string;
            isRestream?: boolean;
        }>(),
        {
            fontSize: '10px',
            isRestream: false
        }
    );

    const boardComponentRef = useTemplateRef<HostBingoBoardInstance>('boardComponent');
    const showResetDialog = ref(false);

    function resetBoard() {
        if (!boardComponentRef.value) return;
        boardComponentRef.value.resetBoard();
    }
</script>

<style scoped>
    /* Direct copy of your working tab's structural setup */
    .grid-container {
        display: grid;
        grid-template-columns: minmax(200px, 600px) 1fr;
        gap: 24px;
        width: 100%;
        padding: 16px;
    }

    .grid-col {
        width: 100%;
    }

    /* Isolated wrapper explicitly maintaining the grid's square shape */
    .board-wrapper {
        width: 100%;
        aspect-ratio: 1 / 1;
    }

    /* Column layout behavior for our actions/legend text on the right side */
    .control-panel {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding-top: 10px; /* Slight alignment offset to balance the top of the grid */
    }

    .legend-entry {
        font-size: 24px; /* Scaled cleanly to feel proportional to your other view */
        font-weight: 500;
        line-height: 1.4;
    }

    .red-legend {
        color: #ff4d4d;
    }
    .blue-legend {
        color: #4da6ff;
    }
</style>
