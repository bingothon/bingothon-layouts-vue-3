<template>
    <div
        class="FlexContainer TeamInfoBox"
        :style="{ height: height }"
        :class="{ ReverseOrder: reverseOrder }"
    >
        <div>
            <BestOfX
                v-if="boXEnabled"
                id="boX"
                :player-index="teamIndex"
                :height="height"
            />
        </div>
        <div :class="medalClasses"></div>
        <div class="TeamNameContainer">
            <TextFit
                :text="`${finishTime} ${name || ''}`"
                :align="reverseOrder ? 'right' : 'left'"
            />
        </div>
        <div
            v-if="bingoColorShown === true"
            class="BingoColor FlexContainer"
            :style="{
                width: parseFloat(height.replace('px', '')) * 0.75 + 'px',
                height: parseFloat(height.replace('px', '')) * 0.75 + 'px',
                'background-color': bingoColor
            }"
        >
            <span v-if="bingoCountShown === true">{{ bingoGoalCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useReplicant } from 'nodecg-vue-composable';
    import { computed } from 'vue';
    import type { Bingoboard } from '../../../../bingothon-layouts/schemas';
    import {
        bestOfX,
        bingoboardMeta,
        currentMainBingoboard,
        oldBundle,
        runDataActiveRunReplicant,
        timerReplicant
    } from '../../browser_shared/replicants';
    import BestOfX from '../components/bestOfX.vue';
    import TextFit from './textFit.vue';

    const props = withDefaults(
        defineProps<{
            teamIndex: number;
            showFlag?: boolean;
            showColor?: boolean;
            height?: string;
            reverseOrder?: boolean;
        }>(),
        {
            showFlag: true,
            showColor: true,
            height: '55px',
            reverseOrder: false
        }
    );

    const name = computed(() => {
        const team = runDataActiveRunReplicant?.data?.teams[props.teamIndex];
        if (!team) {
            return '';
        }
        return team.name;
    });

    const playerIndex = computed(() => {
        if (!runDataActiveRunReplicant?.data?.teams) {
            return -1;
        }
        const team = runDataActiveRunReplicant?.data?.teams[props.teamIndex];
        if (!team) {
            return -1;
        }
        let idx = 0;
        for (let i = 0; i < props.teamIndex; i++) {
            idx += runDataActiveRunReplicant?.data?.teams[i].players.length;
        }
        return idx;
    });

    const bingoColor = computed(() => {
        return bingoboardMeta?.data?.playerColors[playerIndex.value] || 'red';
    });

    const bingoGoalCount = computed(() => {
        if (!currentMainBingoboard?.data?.boardReplicant) {
            return 0;
        }
        if (bingoboardMeta?.data?.manualScoreOverride) {
            return bingoboardMeta.data.manualScores[playerIndex.value];
        }
        const bingoboard = useReplicant<Bingoboard>(currentMainBingoboard.data.boardReplicant, oldBundle, {});
        if (!bingoboard) {
            return 0;
        }
        if (!bingoboardMeta?.data?.manualScoreOverride) {
            return <number>(
                (bingoboard.data?.colorCounts[bingoboardMeta?.data?.playerColors[playerIndex.value] || 'red'] ?? 0)
            );
        } else {
            return bingoboardMeta?.data?.manualScores[playerIndex.value];
        }
    });

    const bingoColorShown = computed(() => {
        return bingoboardMeta?.data?.colorShown && props.showColor;
    });

    const bingoCountShown = computed(() => {
        return bingoboardMeta?.data?.countShown;
    });

    const finishTime = computed(() => {
        // no individual finish time for one team runs
        // also disable for lockout
        if (runDataActiveRunReplicant?.data?.teams.length == 1) {
            return '';
        }
        // get the team this player belongs to
        const teamID = runDataActiveRunReplicant?.data?.teams[props.teamIndex].id;
        if (teamID) {
            const finishTime = timerReplicant?.data?.teamFinishTimes[teamID];
            if (finishTime) {
                // disable time if lockout, but still "change" it, to force a refit
                if (runDataActiveRunReplicant?.data?.customData.Bingotype?.includes('lockout')) {
                    return ' ';
                } else {
                    return `[${finishTime.time}] `;
                }
            }
        }
        return '';
    });

    const medalClasses = computed(() => {
        // no individual finish time for one team runs
        // also this is disabled for some layouts
        if (runDataActiveRunReplicant?.data?.teams.length == 1) {
            return '';
        }
        // get the team this player belongs to
        const teamID = runDataActiveRunReplicant?.data?.teams[props.teamIndex].id;
        if (teamID) {
            const finishTime = timerReplicant?.data?.teamFinishTimes[teamID];
            if (finishTime) {
                let place = 1;
                const finishTimes = timerReplicant?.data?.teamFinishTimes;
                if (!finishTimes) {
                    return '';
                }
                Object.values(finishTimes).forEach((time) => {
                    if (time.milliseconds < finishTime.milliseconds) {
                        place++;
                    }
                });
                let medalColor = null;
                switch (place) {
                    case 1:
                        medalColor = 'gold';
                        break;
                    case 2:
                        medalColor = 'silver';
                        break;
                    case 3:
                        medalColor = 'bronze';
                        break;
                }
                if (medalColor) {
                    return `medal shine medal-${medalColor}`;
                }
            }
        }
        return '';
    });

    const boXEnabled = computed(() => {
        return bestOfX?.data?.enabled;
    });
</script>

<style>
    @import './shared/medals/medals.css';

    .TeamInfoBox {
        color: var(--font-color);
        padding: 7px;
        font-size: 35px;
        height: 60px;
    }

    .TeamInfoBox.ReverseOrder {
        flex-direction: row-reverse;
    }

    .TeamInfoBox > .TeamNameContainer {
        flex-grow: 1;
        flex-shrink: 0;
        height: 100%;
        position: relative;
        white-space: nowrap;
        justify-content: left;
    }

    .TeamInfoBox > .BingoColor {
        justify-content: center;
        height: 55px;
        width: 55px;
        font-size: 30px;
        border-radius: 10%;
        border: 1px white solid;
    }

    .TeamInfoBox.ReverseOrder > .BingoColor {
        margin-right: 20px;
    }

    /* Bingosync styled gradients */
    .TeamInfoBox > .BingoColor.bingo-green {
        background-image: var(--bingo-color-green);
    }

    .TeamInfoBox > .BingoColor.bingo-red {
        background-image: var(--bingo-color-red);
    }

    .TeamInfoBox > .BingoColor.bingo-orange {
        background-image: var(--bingo-color-orange);
    }

    .TeamInfoBox > .BingoColor.bingo-blue {
        background-image: var(--bingo-color-blue);
    }

    .TeamInfoBox > .BingoColor.bingo-purple {
        background-image: var(--bingo-color-purple);
    }

    .TeamInfoBox > .BingoColor.bingo-pink {
        background-image: var(--bingo-color-pink);
    }

    .TeamInfoBox > .BingoColor.bingo-brown {
        background-image: var(--bingo-color-brown);
    }

    .TeamInfoBox > .BingoColor.bingo-teal {
        background-image: var(--bingo-color-teal);
    }

    .TeamInfoBox > .BingoColor.bingo-navy {
        background-image: var(--bingo-color-navy);
    }

    .TeamInfoBox > .BingoColor.bingo-yellow {
        background-image: var(--bingo-color-yellow);
    }
</style>
