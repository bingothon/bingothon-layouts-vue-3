<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import {
        bestOfX,
        bingoboardMeta,
        currentMainBingoboard,
        oldBundle,
        runDataActiveRunReplicant,
        soundOnTwitchStream,
        timerReplicant
    } from '../../../browser_shared/replicants';

    import { useReplicant } from 'nodecg-vue-composable';
    import type { Bingoboard } from '../../../../../bingothon-layouts/schemas';
    import TextFit from '../textFit.vue';
    import playerSoloImg from './player-solo.png';
    import twitchIconImg from './twitch-icon.png';

    const playerAlternate = ref(true);
    let alternateInterval: NodeJS.Timeout;

    const props = withDefaults(
        defineProps<{
            playerIndex?: number;
            showFlag?: boolean;
            showColor?: boolean;
            height?: string;
            reverseOrder?: boolean;
            hideSoundIcon?: boolean;
            hideFinishTime?: boolean;
        }>(),
        {
            playerIndex: -1,
            showFlag: true,
            showColor: true,
            height: '55px',
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

    const player = computed(() => {
        let idx = 0;
        let correctPlayer;
        if (!runDataActiveRunReplicant || !runDataActiveRunReplicant.data || !runDataActiveRunReplicant.data.teams) {
            return undefined;
        }
        if (!runDataActiveRunReplicant.data.relay) {
            for (let i = 0; i < runDataActiveRunReplicant.data.teams.length; i++) {
                const team = runDataActiveRunReplicant.data.teams[i];
                for (let j = 0; j < team.players.length; j++) {
                    if (idx == props.playerIndex) {
                        correctPlayer = team.players[j];
                        // break out of both loops
                        i = 100;
                        break;
                    }
                    idx++;
                }
            }
        } else {
            const team = runDataActiveRunReplicant.data.teams[props.playerIndex];
            correctPlayer = team.players.find((player) => player.id === team.relayPlayerID);
        }
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

    const show = computed(() => {
        return playerAlternate;
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
        if (teamID.value) {
            const finishTime = timerReplicant?.data?.teamFinishTimes[teamID.value];
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

    const teamID = computed(() => {
        let theTeamID = null;
        let playerNum = 0;
        runDataActiveRunReplicant?.data?.teams.forEach((t) => {
            t.players.forEach(() => {
                if (playerNum == props.playerIndex) {
                    theTeamID = t.id;
                }
                playerNum++;
            });
        });
        return theTeamID;
    });

    const teamIndex = computed(() => {
        // use 0 as a default in case this teamindex isn't found
        // which shouldn't happen
        let theTeamIdx = 0;
        let playerNum = 0;
        runDataActiveRunReplicant?.data?.teams.forEach((t, teamdIdx) => {
            t.players.forEach(() => {
                if (playerNum == props.playerIndex) {
                    theTeamIdx = teamdIdx;
                }
                playerNum++;
            });
        });
        return theTeamIdx;
    });

    const bingoColor = computed(() => {
        return bingoboardMeta?.data?.playerColors[props.playerIndex] || 'red';
    });

    const bingoGoalCount = computed(() => {
        if (!currentMainBingoboard?.data?.boardReplicant) {
            return 0;
        }
        if (bingoboardMeta?.data?.manualScoreOverride) {
            return bingoboardMeta.data.manualScores[props.playerIndex];
        }
        const bingoboard = useReplicant<Bingoboard>(currentMainBingoboard.data.boardReplicant, oldBundle, {});
        if (!bingoboard) {
            return 0;
        }
        return <number>(
            (bingoboard.data?.colorCounts[bingoboardMeta?.data?.playerColors[props.playerIndex] || 'red'] ?? 0)
        );
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
        if (teamID.value) {
            const finishTime = timerReplicant?.data?.teamFinishTimes[teamID.value];
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
        return `/bundles/bingothon-layouts/static/flags/${rawFlag}.png`;
    };

    const boXEnabled = computed(() => {
        return bestOfX?.data?.enabled;
    });
</script>

<template>
    <div
        class="FlexContainer PlayerInfoBox"
        :class="{ ReverseOrder: reverseOrder }"
        :style="{ height: height }"
    >
        <div
            class="CurrentIcon FlexContainer"
            :style="{ width: `calc(${height} * 1.5)` }"
        >
            <Transition name="fade">
                <div
                    v-if="show && pronouns"
                    key="pronuns"
                    class="PronounsContainer"
                >
                    <TextFit :text="pronouns" />
                </div>
                <img
                    v-else
                    :key="currentIcon"
                    :src="currentIcon"
                />
            </Transition>
        </div>
        <div v-if="!hideFinishTime">
            <BestOfX
                v-if="boXEnabled"
                id="boX"
                :player-index="teamIndex"
                :height="height"
            />
        </div>
        <div :class="medalClasses"></div>
        <div class="PlayerName">
            <transition name="fade">
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
            <img :src="'/bundles/bingothon-layouts/static/music-note.png'" />
        </div>
        <div
            v-if="!!player?.country"
            class="Flag FlexContainer"
            :style="{ width: `calc(${height} * 1.9)` }"
        >
            <transition name="fade">
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
            :class="``"
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

<style>
    @import './medals.css';

    .PlayerInfoBox {
        /*Summer background-image: linear-gradient(var(--lighter-main-color), var(--darker-main-color));*/
        background-image: linear-gradient(var(--alternative-main-color), var(--darker-main-color));
        color: var(--font-color);
        padding: 7px;
        font-weight: 500;
        font-size: 30px;
    }

    .PlayerInfoBox.ReverseOrder {
        flex-direction: row-reverse;
    }

    .PlayerInfoBox > .CurrentIcon {
        height: 100%;
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
        /* color: #f3ad00; */
        /* border: 1px solid #f3ad00; */
        /* background-color: #f3ad00; */
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
        transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>
