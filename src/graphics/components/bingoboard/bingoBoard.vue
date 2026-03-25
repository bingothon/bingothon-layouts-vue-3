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
                        :id="'tile-' + i + '-' + j"
                        :key="i + '' + j"
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
                                :font-size="fontSize"
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
            class="bingo-board-hide"
            :hidden="!boardHidden"
        >
            <p id="soon">Bingo Board will be revealed soon&trade;</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useDynamicReplicant } from 'nodecg-vue-composable';
    import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch, type Ref } from 'vue';
    import type { Bingoboard } from '../../../../../bingothon-layouts/schemas';
    import { bingoboardMeta, currentMainBingoboard, oldBundle } from '../../../browser_shared/replicants';
    import CellTextFit from '../helpers/cellTextFit.vue';
    import { colorsToTransforms, colorToGradient, defaultBingoBoard, type BingoCell } from './util';

    const props = withDefaults(
        defineProps<{
            fontSize: string;
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

    const boardHidden = computed(() => {
        return bingoboardMeta?.data?.boardHidden && !props.alwaysShown;
    });

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
</style>
