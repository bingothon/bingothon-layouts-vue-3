<template>
    <div
        class="FlexContainer PlayerInfoBox"
        :class="{ ReverseOrder: reverseOrder }"
        :style="{ height: height }"
    >
        <div v-if="!hideFinishTime">
            <BestOfX
                v-if="boXEnabled"
                id="boX"
                :player-index="teamIndex"
                :height-px="heightPx * 0.75"
            />
        </div>
        <div class="CurrentIcon FlexContainer">
            <transition
                name="fade"
                mode="out-in"
            >
                <div
                    v-if="show && pronouns"
                    key="pronouns"
                    class="PronounsContainer"
                >
                    <TextFit :text="pronouns" />
                </div>
                <img
                    v-else
                    :key="currentIcon"
                    :src="currentIcon"
                />
            </transition>
        </div>
        <div :class="medalClasses"></div>
        <div class="PlayerName">
            <transition
                name="fade"
                mode="out-in"
            >
                <TextFit
                    :key="text"
                    :text="finishTime + text"
                    :align="reverseOrder ? 'right' : 'left'"
                />
            </transition>
        </div>
        <div
            v-if="showSound"
            class="Sound"
        >
            <img :src="`/bundles/${oldBundle}/static/music-note.png`" />
        </div>
        <div
            v-if="!!player?.country"
            class="Flag FlexContainer"
        >
            <transition
                name="fade"
                mode="out-in"
            >
                <img
                    :key="player.country"
                    :style="{ visibility: showFlag ? 'visible' : 'hidden' }"
                    :src="getPlayerFlag(player.country)"
                />
            </transition>
        </div>
        <div
            v-if="bingoColorShown === true"
            class="BingoColor FlexContainer"
            :style="{
                'background-color': bingoColor
            }"
        >
            <span v-if="bingoCountShown === true">{{ bingoGoalCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import {
        bestOfX,
        bingoboardMeta,
        currentMainBingoboard,
        oldBundle,
        playerSlotsReplicant,
        runDataActiveRunReplicant,
        soundOnTwitchStream,
        timerReplicant
    } from '../../../browser_shared/replicants';

    import { useReplicant } from 'nodecg-vue-composable';
    import type { Bingoboard } from '../../../../../bingothon-layouts/schemas';
    import TextFit from '../helpers/textFits/textFit.vue';
    import BestOfX from './bestOfX.vue';
    import playerSoloImg from './player-solo.png';
    import twitchIconImg from './twitch-icon.png';
    import type { RunDataPlayer } from 'speedcontrol-util/types/speedcontrol';

    const playerAlternate = ref(true);
    let alternateInterval: NodeJS.Timeout;

    const props = withDefaults(
        defineProps<{
            playerIndex?: number;
            showFlag?: boolean;
            showColor?: boolean;
            heightPx?: number;
            reverseOrder?: boolean;
            hideSoundIcon?: boolean;
            hideFinishTime?: boolean;
        }>(),
        {
            playerIndex: -1,
            showFlag: true,
            showColor: true,
            heightPx: 55,
            reverseOrder: false,
            hideSoundIcon: false,
            hideFinishTime: false
        }
    );

    onMounted(() => {
        alternateInterval = setInterval(() => {
            playerAlternate.value = !playerAlternate.value;
        }, 10000);
    });

    onUnmounted(() => {
        if (alternateInterval) {
            clearInterval(alternateInterval);
        }
    });

    const height = computed(() => {
        return `${props.heightPx}px`;
    });

    const player = computed<RunDataPlayer | undefined>(() => {
        if (!runDataActiveRunReplicant || !runDataActiveRunReplicant.data || !runDataActiveRunReplicant.data.teams) {
            return undefined;
        }
        const allPlayers = runDataActiveRunReplicant?.data?.teams.flatMap((t) => t.players);
        const playerId = playerSlotsReplicant?.data?.slots[props.playerIndex].playerId;
        const correctPlayer = allPlayers.find((player) => player.id === playerId);
        if (!correctPlayer) {
            return {
                name: 'test2',
                id: '-1',
                teamID: '-1',
                country: 'eu',
                social: {
                    twitch: ''
                },
                customData: {
                    pronouns: 'they/them'
                }
            };
        }
        return correctPlayer;
    });

    const runnerIndex = computed(() => {
        if (!runDataActiveRunReplicant || !runDataActiveRunReplicant.data || !runDataActiveRunReplicant.data.teams) {
            return -1;
        }

        const allPlayers = runDataActiveRunReplicant?.data?.teams.flatMap((t) => t.players);
        return player.value ? allPlayers.indexOf(player.value) : -1;
    });

    const show = computed(() => {
        return playerAlternate.value;
    });

    const currentIcon = computed(() => {
        if (playerAlternate.value) {
            return playerSoloImg;
        } else {
            return twitchIconImg;
        }
    });

    const text = computed(() => {
        if (show.value) {
            return player.value?.name;
        } else {
            return '/' + player.value?.social.twitch;
        }
    });

    const pronouns = computed(() => {
        if (player.value?.pronouns) {
            if (!player.value.pronouns.includes(',')) {
                return player.value.pronouns.toString();
            }
            if (player.value.pronouns.includes('he/him') && player.value.pronouns.includes('they/them')) {
                return 'he/them';
            }
            if (player.value.pronouns.includes('she/her') && player.value.pronouns.includes('they/them')) {
                return 'she/them';
            }
            return 'they/them';
        }
        return '';
    });

    const finishTime = computed(() => {
        // no individual finish time for one team runs
        // also this is disabled for some layouts
        if (props.hideFinishTime || runDataActiveRunReplicant?.data?.teams.length == 1) {
            return '';
        }
        // get the team this player belongs to
        if (teamId.value) {
            const finishTime = timerReplicant?.data?.teamFinishTimes[teamId.value];
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

    const teamIndex = computed(() => {
        const team = runDataActiveRunReplicant?.data?.teams.find((t) => t.id === teamId.value);
        return team ? runDataActiveRunReplicant!.data!.teams.indexOf(team) : -1;
    });

    const teamId = computed(() => {
        return player.value?.teamID;
    });

    const bingoColor = computed(() => {
        return bingoboardMeta?.data?.playerColors[runnerIndex.value] || 'red';
    });

    const bingoGoalCount = computed(() => {
        if (!currentMainBingoboard?.data?.boardReplicant) {
            return 0;
        }
        if (bingoboardMeta?.data?.manualScoreOverride) {
            return bingoboardMeta.data.manualScores[runnerIndex.value];
        }
        const bingoboard = useReplicant<Bingoboard>(currentMainBingoboard.data.boardReplicant, oldBundle, {});
        if (!bingoboard) {
            return 0;
        }
        return <number>(bingoboard.data?.colorCounts[bingoColor.value] ?? 0);
    });

    const bingoColorShown = computed(() => {
        return bingoboardMeta?.data?.colorShown && props.showColor;
    });

    const bingoCountShown = computed(() => {
        return bingoboardMeta?.data?.countShown;
    });

    const showSound = computed(() => {
        return props.playerIndex == soundOnTwitchStream?.data && !props.hideSoundIcon;
    });

    const medalClasses = computed(() => {
        // no individual finish time for one team runs
        // also this is disabled for some layouts
        if (props.hideFinishTime || runDataActiveRunReplicant?.data?.teams.length == 1) {
            return '';
        }
        // const the team this player belongs to
        if (teamId.value) {
            const finishTime = timerReplicant?.data?.teamFinishTimes[teamId.value];
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

    const getPlayerFlag = (rawFlag: string) => {
        return `/bundles/${oldBundle}/static/flags/${rawFlag}.png`;
    };

    const boXEnabled = computed(() => {
        return bestOfX?.data?.enabled;
    });
</script>

<style>
    @import '../shared/medals/medals.css';

    .PlayerInfoBox {
        background-image: linear-gradient(var(--alternative-main-color), var(--darker-main-color));
        color: var(--font-color);
        padding: 7px;
        font-weight: 500;
        font-size: 30px;
        box-sizing: border-box;
    }

    .PlayerInfoBox.ReverseOrder {
        flex-direction: row-reverse;
    }

    .PlayerInfoBox > .CurrentIcon {
        height: 100%;
        width: calc(v-bind(height) * 1.5);
        text-align: left;
        position: relative;
    }

    .PlayerInfoBox > .CurrentIcon > img {
        height: 100%;
        position: absolute;
        filter: invert(100%);
    }

    .PlayerInfoBox > .CurrentIcon > .PronounsContainer {
        font-size: 60%;
        bottom: 1px;
        color: white;
        height: 75%;
        position: absolute;
        width: 70px;
    }

    .PlayerInfoBox > .PlayerName {
        flex-grow: 1;
        flex-shrink: 0;
        height: 100%;
        margin-left: 10px;
        margin-right: 10px;
        justify-content: flex-start;
        position: relative;
    }

    /*.PlayerInfoBox > .PlayerName > div > .FinishTime {
  color: var(--font-colour);
}*/

    .PlayerInfoBox > .Flag {
        height: 100%;
        width: calc(v-bind(height) * 1.9);
        justify-content: flex-end;
        position: relative;
        margin-right: 15px;
    }

    .PlayerInfoBox.ReverseOrder > .Flag {
        justify-content: flex-start;
    }

    .PlayerInfoBox > .Flag > img {
        visibility: visible;
        position: absolute;
        border: 1px solid white;
        height: calc(100% - 2px);
    }

    .PlayerInfoBox > .BingoColor {
        justify-content: center;
        margin-left: 14px;
        font-size: 30px;
        border-radius: 10%;
        border: 1px white solid;
        box-sizing: content-box;
        height: calc(v-bind(height) * 0.75);
        width: calc(v-bind(height) * 0.75);
    }

    .PlayerInfoBox.ReverseOrder > .BingoColor {
        margin-left: 0px;
        margin-right: 14px;
    }

    .PlayerInfoBox > .Sound > img {
        width: 30px;
    }

    /* Bingosync styled gradients */
    .PlayerInfoBox > .BingoColor.bingo-green {
        background-image: var(--bingo-color-green);
    }

    .PlayerInfoBox > .BingoColor.bingo-red {
        background-image: var(--bingo-color-red);
    }

    .PlayerInfoBox > .BingoColor.bingo-orange {
        background-image: var(--bingo-color-orange);
    }

    .PlayerInfoBox > .BingoColor.bingo-blue {
        background-image: var(--bingo-color-blue);
    }

    .PlayerInfoBox > .BingoColor.bingo-purple {
        background-image: var(--bingo-color-purple);
    }

    .PlayerInfoBox > .BingoColor.bingo-pink {
        background-image: var(--bingo-color-pink);
    }

    .PlayerInfoBox > .BingoColor.bingo-brown {
        background-image: var(--bingo-color-brown);
    }

    .PlayerInfoBox > .BingoColor.bingo-teal {
        background-image: var(--bingo-color-teal);
    }

    .PlayerInfoBox > .BingoColor.bingo-navy {
        background-image: var(--bingo-color-navy);
    }

    .PlayerInfoBox > .BingoColor.bingo-yellow {
        background-image: var(--bingo-color-yellow);
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 1s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    /* global animation stuff */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
