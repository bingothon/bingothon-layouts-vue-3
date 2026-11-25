<template>
    <div class="QuizBoard">
        <table
            v-if="!selected"
            class="bingo-table"
        >
            <tbody>
                <tr
                    v-for="(row, i) in cells"
                    :key="i"
                >
                    <td
                        v-for="(cell, j) in row"
                        :key="`${i}:${j}`"
                        class="square"
                        @click="select(j, i)"
                    >
                        <div
                            v-for="color in cell.colors"
                            :key="color"
                            :class="'bg-color ' + color + 'square'"
                            :style="{ backgroundColor: color }"
                        ></div>
                        <div class="shadow"></div>
                        <div class="CellTextFitContainer">
                            <CellTextFit
                                :text="cell.name"
                                font-size="14px"
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="selected">
            <single-view :selected></single-view>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { quizBingoCellsReplicant, quizBingoReplicant, thisBundle } from '../../browser_shared/replicants.ts';
    import '../../graphics/components/bingoboard/bingosync-style.css';
    import type { Schemas } from '../../types';
    import CellTextFit from '../../graphics/components/helpers/textFits/cellTextFit.vue';
    import SingleView from './components/singleView.vue';

    type QuizCell = Schemas.QuizBingoCells['cells'][number][number];
    const emptyBoard: QuizCell[][] = Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => ({ name: '', colors: [], rawColors: 'blank' }))
    );

    const cells = computed(() => {
        const repCells = quizBingoCellsReplicant?.data?.cells;
        return repCells?.length ? repCells : emptyBoard;
    });

    const selected = computed(() => quizBingoReplicant?.data?.currentlySelected ?? null);

    function select(cat: number, diff: number) {
        nodecg.sendMessageToBundle('quiz:select', thisBundle, { row: diff, column: cat });
    }
</script>

<style scoped>
    .QuizBoard {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
    }

    .bingo-table {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .square {
        padding: 0;
        width: calc(100% / 5);
        height: calc(100% / 5);
        border: 2px black solid;
        box-sizing: border-box;
    }

    .square .bg-color,
    .square .shadow {
        left: 0;
        right: 0;
    }

    .CellTextFitContainer {
        position: absolute;
        inset: 2px;
    }
</style>
