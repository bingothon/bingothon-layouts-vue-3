<template>
    <div
        ref="bingoboard"
        class="BingoBoard"
    >
        <table class="bingo-table">
            <tbody ref="tableBody">
                <tr
                    v-for="(column, i) in bingoCells"
                    :key="i"
                >
                    <td
                        v-for="(cell, j) in column"
                        :id="`tile-${i}-${j}`"
                        :key="`${i}:${j}`"
                        class="square"
                        :title="cell.description"
                        @click="updateCell(cell, i, j, true)"
                        @contextmenu="
                            (e) => {
                                e.preventDefault();
                                updateCell(cell, i, j);
                            }
                        "
                    >
                        <div
                            v-for="color in cellStyles[`${i}-${j}`]"
                            :key="color.color"
                            :class="'bg-color ' + color.color + 'square'"
                            :style="`background-color: ${color.color}; ${color.style};`"
                        ></div>
                        <div class="shadow"></div>
                        <div class="CellTextFitContainer">
                            <CellTextFit
                                :text="cell.goal"
                                :font-size="props.fontSize"
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, useTemplateRef } from 'vue';
    import type { HostBingoCell } from '../../../../../bingothon-layouts/schemas';
    import goals from '../../../../../bingothon-layouts/static/hostBingo.json';
    import { hostingBingoboard } from '../../../browser_shared/replicants';
    import CellTextFit from '../helpers/cellTextFit.vue';
    import { translatePercent } from './util';

    const props = withDefaults(
        defineProps<{
            fontSize?: string;
            isRestream?: boolean;
        }>(),
        {
            fontSize: '10px',
            isRestream: false
        }
    );

    const bingoCells = computed(() => hostingBingoboard?.data ?? []);
    const rowCount = computed(() => bingoCells.value.length);
    const columnCount = computed(() => bingoCells.value[0]?.length ?? 0);

    const cellStyles = computed(() => {
        const rawCells = hostingBingoboard?.data ?? [];
        const stylesMap: Record<string, { color: string; style: string }[]> = {};

        rawCells.forEach((column, i) => {
            column.forEach((cell, j) => {
                const colors = [];
                if (cell.marked) colors.push('red');
                if (cell.markedRestream1) colors.push('blue');
                if (cell.markedRestream2) colors.push('green');

                const transformedColors = [];
                if (colors.length > 0) {
                    transformedColors.push({ color: colors[0], style: '' });
                }

                const translations = translatePercent[colors.length];
                for (let k = 1; k < colors.length; k++) {
                    transformedColors.push({
                        color: colors[k],
                        style: `transform: skew(-${skewAngle.value}rad) translateX(${translations[k]}%); border-right: solid 1.5px #444444`
                    });
                }

                stylesMap[`${i}-${j}`] = transformedColors;
            });
        });

        return stylesMap;
    });

    defineExpose({ resetBoard });

    function resetBoard() {
        if (hostingBingoboard) {
            hostingBingoboard.data = toColumns(goals);
            hostingBingoboard.save();
        }
    }

    function updateCell(cell: HostBingoCell, col: number, row: number, primaryClick?: boolean) {
        if (!hostingBingoboard?.data) return;
        if (props.isRestream) {
            if (primaryClick) {
                hostingBingoboard.data[col][row] = {
                    ...cell,
                    markedRestream1: !cell.markedRestream1
                };
            } else {
                hostingBingoboard.data[col][row] = {
                    ...cell,
                    markedRestream2: !cell.markedRestream2
                };
            }
        } else {
            hostingBingoboard.data[col][row] = {
                ...cell,
                marked: !cell.marked
            };
        }
        hostingBingoboard.save();
    }

    function toColumns(goals: { goal: string; description: string }[]): HostBingoCell[][] {
        const result = [];
        for (let i = 0; i < 5; i++) {
            const cur: HostBingoCell[] = [];
            for (let j = 0; j < 5; j++) {
                const goal = goals[i * 5 + j];
                cur.push({ ...goal, marked: false, markedRestream1: false, markedRestream2: false });
            }
            result.push(cur);
        }
        return result;
    }

    const skewAngle = ref(1);
    const bingoboardElem = useTemplateRef<HTMLElement>('bingoboard');
    onMounted(() => {
        const boardElem = bingoboardElem.value;
        if (!boardElem) return;
        skewAngle.value = Math.atan(boardElem.clientWidth / boardElem.clientHeight);
    });
</script>

<style lang="css">
    @import url(./bingosync-style.css);

    .BingoBoard {
        width: 100%;
        height: 100%;
        position: relative;
        box-sizing: border-box;
    }

    .bingo-table {
        width: 100%;
        height: 100%;
        position: absolute;
        border-collapse: separate;
        border-spacing: 0;
        table-layout: fixed;
    }

    .square {
        padding: 0;
        height: calc(100% / v-bind(rowCount));
        width: calc(100% / v-bind(columnCount));
        border: 2px black solid;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;

        /* Quasar layout rendering context overrides */
        transform-style: flat !important;
        backface-visibility: visible !important;
        isolation: isolate;
    }

    .square .bg-color {
        width: 102% !important;
        height: 102% !important;
        position: absolute;
        top: -1%;
        left: -1%;
        padding: 0;
        border: 0;
        z-index: 1;
    }

    .square .shadow {
        width: 102% !important;
        height: 102% !important;
        position: absolute;
        top: -1%;
        left: -1%;
        z-index: 2;
        pointer-events: none;
    }

    .CellTextFitContainer {
        height: calc(100% - 4px);
        width: calc(100% - 4px);
        position: absolute;
        margin: 2px;
        z-index: 3;
    }
</style>
