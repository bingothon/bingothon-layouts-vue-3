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
                    >
                        <div
                            v-for="color in cell.colors"
                            :key="color.color"
                            :class="'bg-color ' + color.color + 'square'"
                            :style="`background-color: ${color.color}; ${color.style}`"
                        ></div>
                        <div class="shadow"></div>
                        <div
                            v-for="(marker, k) in cell.markers"
                            :key="k"
                            :class="getMarkerClasses(marker, k)"
                        ></div>
                        <div class="CellTextFitContainer">
                            <CellTextFit
                                :text="cell.name"
                                :font-size="props.fontSize"
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="bingo-splash-container">
            <div
                class="bingo-splash"
                :style="{ color: bingoAnimColor }"
                :class="splashActivated"
            >
                BINGO!
            </div>
        </div>
        <div
            ref="revealSquare"
            class="revealSquare"
        >
            BINGO
        </div>
        <div
            class="bingo-board-hide"
            :hidden="!boardHidden"
        >
            <p id="soon">Bingo Board will be revealed soon&trade;</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useDynamicReplicant } from 'nodecg-vue-composable';
    import { computed, onMounted, onUnmounted, ref, type Ref, useTemplateRef, watch } from 'vue';
    import type { Bingoboard } from '../../../../../bingothon-layouts/schemas';
    import { bingoboardMeta, currentMainBingoboard, oldBundle } from '../../../browser_shared/replicants';
    import CellTextFit from '../helpers/cellTextFit.vue';
    import { type BingoCell, colorsToTransforms, colorToGradient, defaultBingoBoard } from './util';

    const props = withDefaults(
        defineProps<{
            fontSize?: string;
            bingoboardRep?: string | null;
            alwaysShown?: boolean;
        }>(),
        {
            fontSize: '10px',
            bingoboardRep: null,
            alwaysShown: false
        }
    );

    const bingoCells: Ref<BingoCell[][]> = ref(defaultBingoBoard());

    const skewAngle = ref(1);
    const splashActivated = ref('');
    const splashFontSize = ref('10px');
    const bingoAnimColor = ref('');
    const rowCount = computed(() => bingoCells.value.length);
    const columnCount = computed(() => bingoCells.value[0]?.length ?? 0);
    const bingoboardElem = useTemplateRef<HTMLElement>('bingoboard');

    const bingoRep = computed(() => {
        const bingoRep = props.bingoboardRep ?? currentMainBingoboard?.data?.boardReplicant ?? 'bingoboard';
        return bingoRep;
    });

    const bingoboard = useDynamicReplicant<Bingoboard>(bingoRep, oldBundle, {});

    function onBingoBoardUpdate(newGoals: Bingoboard) {
        if (!newGoals) return;
        bingoCells.value = newGoals.cells.map((row) =>
            row.map((cell) => ({
                name: cell.name,
                markers: cell.markers,
                rawColors: cell.rawColors,
                colors: colorsToTransforms(cell.colors, skewAngle.value)
            }))
        );
    }

    watch(
        () => bingoboard.value.data,
        () => onBingoBoardUpdate(bingoboard.value.data)
    );

    function showBingoSplash(data: { color?: string }) {
        if (splashActivated.value != '') return;
        bingoAnimColor.value = colorToGradient[data.color ?? 'red'] ?? data.color;
        splashActivated.value = 'activated';
        setTimeout(() => (splashActivated.value = ''), 4000);
    }

    onUnmounted(() => {
        nodecg.unlisten('showBingoAnimation', oldBundle, showBingoSplash);
    });

    onMounted(() => {
        const boardElem = bingoboardElem.value;
        if (!boardElem) return;
        skewAngle.value = Math.atan(boardElem.clientWidth / boardElem.clientHeight);
        splashFontSize.value = `${boardElem.clientWidth / 5}px`;
        nodecg.listenFor('showBingoAnimation', oldBundle, showBingoSplash);
    });

    function getMarkerClasses(marker: string | null, markerIndex: number): string {
        if (!marker) {
            return '';
        } else {
            return `marker marker${markerIndex} ${marker}square`;
        }
    }

    /** start animation related */

    const revealSquareElem = useTemplateRef<HTMLElement>('revealSquare');
    const revealSquareX = ref(2);
    const revealSquareY = ref(2);
    const revealAnimationRunning = ref(false);

    const boardHidden = computed(() => {
        return bingoboardMeta?.data?.boardHidden && !props.alwaysShown;
    });

    watch(() => boardHidden.value, triggerRevealAnimation, { immediate: false });

    function triggerRevealAnimation() {
        if (boardHidden.value) return;
        doRolling();
    }

    function calculateTransitionDuration(sequenceIndex: number) {
        return (0.15 / (sequenceIndex + 1)) * 3;
    }

    function getRevealSequence(
        rowCount: number,
        columnCount: number
    ): { row: number; col: number; direction: number }[] {
        // we start in the bottom right corner, go up and then always follow the wall until we visited every tile
        function move(col: number, row: number, direction: number): [number, number] {
            switch (direction) {
                case 0:
                    return [col, row - 1];
                case 1:
                    return [col - 1, row];
                case 2:
                    return [col, row + 1];
                default:
                    return [col + 1, row];
            }
        }
        const pool = new Set(
            Array(rowCount)
                .fill(null)
                .flatMap((_, row) =>
                    Array(columnCount)
                        .fill(null)
                        .map((_, col) => `${row}-${col}`)
                )
        );
        let currentRow = rowCount;
        let currentCol = columnCount - 1;
        let direction = 0;
        const seq = [];
        for (let i = 0; i < rowCount * columnCount; i++) {
            // try to move, if it doesn't work, turn
            let [nextCol, nextRow] = move(currentCol, currentRow, direction);
            if (!pool.has(`${nextRow}-${nextCol}`)) {
                direction = (direction + 1) % 4;
                [nextCol, nextRow] = move(currentCol, currentRow, direction);
            }
            currentRow = nextRow;
            currentCol = nextCol;
            seq.push({ row: currentRow, col: currentCol, direction });
            pool.delete(`${currentRow}-${currentCol}`);
        }
        return seq.reverse();
    }

    async function doRolling() {
        if (revealAnimationRunning.value) return;
        revealAnimationRunning.value = true;
        const revealSquare = revealSquareElem.value;
        if (!revealSquare) {
            return;
        }
        revealSquare.style.opacity = '1';
        const revealSequence = getRevealSequence(rowCount.value, columnCount.value);
        const squares = Array.from(bingoboardElem.value?.getElementsByClassName('square') ?? []) as HTMLElement[];
        squares.forEach((square) => (square.style.opacity = '0'));
        revealSquare.style.transitionDuration = '0s';
        revealSquareX.value = revealSequence[0].col;
        revealSquareY.value = revealSequence[0].row;
        // delay to make initial position take effect
        await delay(10);
        try {
            for (let i = 0; i < revealSequence.length; i++) {
                const { col, row } = revealSequence[i];
                const transitionDuration = calculateTransitionDuration(i);

                revealSquare.style.transitionDuration = `${transitionDuration}s`;
                revealSquareX.value = col;
                revealSquareY.value = row;

                await delay(transitionDuration * 1000);

                const tile = squares[row * columnCount.value + col];
                if (tile) {
                    tile.style.opacity = '1';
                }
            }
        } catch (error) {
            console.log('Error in doRolling:', error);
        } finally {
            revealSquare.style.opacity = '0';

            // Reveal all tiles
            squares.forEach((cell) => (cell.style.opacity = '1'));
            revealAnimationRunning.value = false;
        }
    }

    function delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
</script>

<style lang="css">
    @import url(./bingosync-style.css);
    table {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .bingo-board-hide {
        width: 100%;
        height: 100%;
        background: black;
        position: absolute;
        top: 0;
        color: white;
        align-content: center;
        justify-content: center;
        font-size: 45px;
        text-align: center;
        align-items: center;
    }

    #soon {
        margin: 0;
        position: absolute;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
    }

    .bingo-splash-container {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: v-bind(splashFontSize);
        color: red;
    }

    .bingo-splash {
        opacity: 0;
    }

    .bingo-splash.activated {
        animation: bingo-splash 4s;
    }

    @keyframes bingo-splash {
        0% {
            opacity: 0;
            font-size: 1%;
        }
        40% {
            transform: rotate(1800deg);
            opacity: 1;
            font-size: 100%;
            text-shadow:
                -5px -5px 10px white,
                5px -5px 10px white,
                -5px 5px 10px white,
                5px 5px 10px white;
        }
        70% {
            transform: rotate(1800deg);
            opacity: 1;
            font-size: 100%;
            text-shadow:
                -5px -5px 10px white,
                5px -5px 10px white,
                -5px 5px 10px white,
                5px 5px 10px white;
        }
        100% {
            transform: rotate(1800deg) translateY(30%);
            opacity: 0;
            font-size: 90%;
            text-shadow:
                -5px -5px 50px white,
                5px -5px 50px white,
                -5px 5px 50px white,
                5px 5px 50px white;
        }
    }

    .square .bg-color,
    .square .shadow {
        width: 100%;
        height: 100%;
        /*Remove padding cause the board is kinda small*/
        padding: 0;
        border: 0;
        left: 0;
        right: 0;
    }

    .square {
        padding: 0;
        height: calc(100% / v-bind(rowCount));
        width: calc(100% / v-bind(columnCount));
        border: 2px black solid;
        box-sizing: border-box;
    }

    [id^='tile-'] {
        visibility: visible;
    }

    .text-container {
        left: 0px;
        right: 0px;
    }
    .bingo-table {
        border-collapse: collapse;
    }
    .text-span {
        left: 0px;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
    }
    .CellTextFitContainer {
        height: calc(100% - 4px);
        width: calc(100% - 4px);
        position: absolute;
        margin: 2px;
    }
    .marker {
        position: absolute;
        width: 20px;
        height: 20px;
        opacity: 0.9;
        border: 3px #0009 solid;
        border-radius: 50%;
    }
    .marker0 {
        left: 10%;
        top: 10%;
    }
    .marker1 {
        right: 10%;
        top: 10%;
    }
    .marker2 {
        left: 10%;
        bottom: 10%;
    }
    .marker3 {
        right: 10%;
        bottom: 10%;
    }
    @keyframes tile-border {
        0% {
            border-color: transparent;
        }
        100% {
            border-color: black;
        }
    }
    .isRevealing {
        opacity: 0;
        animation: tile-border 0.5s ease-in-out;
    }
    .revealSquare {
        position: absolute;
        background-color: white;
        height: calc(100% / v-bind(rowCount));
        width: calc(100% / v-bind(columnCount));
        top: calc(100% * v-bind(revealSquareY) / v-bind(rowCount));
        left: calc(100% * v-bind(revealSquareX) / v-bind(columnCount));
        opacity: 0;

        transition-timing-function: linear;

        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5em;
        color: #333; /* Using the same color as .GameChip */
        box-sizing: border-box;

        /* Applying the ice cube styles from .GameChip */
        padding: 3px 4px;
        background-color: rgba(220, 240, 255, 1); /* Light blueish */
        border-radius: 2px;
        border: 1px solid rgba(18, 98, 138, 0.877); /* Slightly blueish border for that 'frozen' feel */

        /* Ice-like gradient background using SVG */
        background-image: url('data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="iceGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgba(240, 255, 255, 0.7); stop-opacity:1" /><stop offset="100%" style="stop-color:rgba(200, 240, 255, 0.9); stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(%23iceGradient)" /></svg>');
        box-shadow: 0px 0px 5px 2px rgba(8, 69, 92, 0.342); /* Subtle glow to add depth */
    }
</style>
