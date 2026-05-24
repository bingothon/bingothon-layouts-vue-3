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
                            v-for="color in calculateBgColorStyles(cell)"
                            :key="color.color"
                            :class="'bg-color ' + color.color + 'square'"
                            :style="`background-color: ${color.color}; ${color.style}`"
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
        // console.log(goals);
        const result = [];
        for (let i = 0; i < 5; i++) {
            const cur: HostBingoCell[] = [];
            for (let j = 0; j < 5; j++) {
                const goal = goals[i * 5 + j];
                cur.push({ ...goal, marked: false, markedRestream1: false, markedRestream2: false });
            }
            result.push(cur);
        }
        // console.log(result);
        return result;
    }

    const skewAngle = ref(1);
    const bingoboardElem = useTemplateRef<HTMLElement>('bingoboard');
    onMounted(() => {
        const boardElem = bingoboardElem.value;
        if (!boardElem) return;
        skewAngle.value = Math.atan(boardElem.clientWidth / boardElem.clientHeight);
    });

    function calculateBgColorStyles(cell: HostBingoCell): { color: string; style: string }[] {
        const colors = [];
        if (cell.marked) {
            colors.push('red');
        }
        if (cell.markedRestream1) {
            colors.push('blue');
        }
        if (cell.markedRestream2) {
            colors.push('green');
        }
        const newColors = [];
        if (colors.length > 0) {
            newColors.push({ color: colors[0], style: '' });
        }
        const translations = translatePercent[colors.length];
        for (let i = 1; i < colors.length; i++) {
            // how bingosync handles the backgrounds, set style here to simply bind it to html later
            newColors.push({
                color: colors[i],
                style: `transform: skew(-${skewAngle.value}rad) translateX(${translations[i]}%); border-right: solid 1.5px #444444`
            });
        }
        return newColors;
    }
</script>

<style lang="css">
    @import url(./bingosync-style.css);

    .BingoBoard {
        width: 100%;
        height: 100%;
        position: relative;
    }

    table {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .square {
        padding: 0;
        height: calc(100% / v-bind(rowCount));
        width: calc(100% / v-bind(columnCount));
        border: 2px black solid;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
    }

    .CellTextFitContainer {
        height: calc(100% - 4px);
        width: calc(100% - 4px);
        position: absolute;
        margin: 2px;
    }

    .bingo-table {
        border-collapse: collapse;
    }
</style>
