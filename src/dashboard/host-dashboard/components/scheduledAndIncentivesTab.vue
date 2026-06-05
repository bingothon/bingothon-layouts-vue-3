<template>
    <div class="grid-container">
        <div class="grid-col">
            <div class="header">Run Schedule:</div>
            <div id="runsContainer">
                <div
                    id="currentRunInfo"
                    class="entry"
                >
                    Running right now:
                    <div>
                        <div class="name">{{ currentRun.game }} - {{ currentRun.category }}</div>
                        <div class="runners">
                            {{ runnersToString(currentRun) }}
                        </div>
                    </div>
                    <br />
                    <div
                        v-if="currentRun.customData.runnerInfo"
                        class="runnerInfo"
                    >
                        Runner Info:
                        <div>
                            {{ currentRun.customData.runnerInfo }}
                        </div>
                    </div>
                </div>
                <div
                    v-if="comingUpRun"
                    class="entry"
                >
                    Coming Up:
                    <div>
                        <div class="name">{{ comingUpRun.game }} - {{ comingUpRun.category }}</div>
                        <div class="runners">
                            {{ runnersToString(comingUpRun) }}
                        </div>
                    </div>
                </div>
                <div
                    v-if="afterThatRun"
                    class="entry"
                >
                    And next:
                    <div>
                        <div class="name">{{ afterThatRun.game }} - {{ afterThatRun.category }}</div>
                        <div class="runners">
                            {{ runnersToString(afterThatRun) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid-col">
            <div class="header">Upcoming Goals/Bidwars:</div>
            <div id="bidsContainer">
                <div
                    v-for="(bid, i) in openBids"
                    :key="i"
                    class="entry"
                >
                    <div class="name">{{ bid.game }} - {{ bid.bid }}</div>
                    <div v-if="bid.goal">
                        <div class="bidRaised">
                            {{ formatAmount(bid.amount_raised) }} /
                            {{ formatAmount(bid.goal) }}
                        </div>
                        <div class="bidLeft">{{ formatAmount(bid.goal - bid.amount_raised) }} left to go!</div>
                    </div>
                    <div v-else>
                        <div v-if="bid.options.length">
                            <div
                                v-for="(option, j) in bid.options"
                                :key="i + ' ' + j"
                                class="bidOption"
                            >
                                {{ option.name }} - {{ formatAmount(option.amount_raised) }}
                            </div>
                            <div
                                v-if="bid.allow_custom_options"
                                class="customOptions"
                            >
                                Users can submit their own options
                            </div>
                        </div>
                        <div
                            v-else
                            class="NoOptions"
                        >
                            No options submitted yet.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid-col">
            <div class="header">Currently Available Prizes:</div>
            <div id="prizesContainer">
                <div
                    v-for="(prize, k) in prizes"
                    :key="k"
                    class="entry"
                >
                    <div class="name">
                        {{ prize.name }}
                    </div>
                    <div class="prizeInfo">Provided by {{ prize.provider }}</div>
                    <div class="prizeInfo">Minimum Donation: {{ formatAmount(Number(prize.minDonation)) }}</div>
                    <div class="prizeInfo">
                        {{ getPrizeTimeUntilString(prize.endtime) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { RunData } from 'speedcontrol-util/types/speedcontrol';
    import {
        runDataActiveRunReplicant,
        runDataArrayReplicant,
        trackerPrizesReplicant
    } from '../../../browser_shared/replicants';
    import { formatAmount } from '../../../browser_shared/formatAmount';
    import { trackerOpenBidsReplicant } from '../../../browser_shared/replicants';

    const currentRun = computed(() => runDataActiveRunReplicant!.data!);
    const comingUpRun = computed(() => getNextRuns(currentRun.value.id, 1));
    const afterThatRun = computed(() => getNextRuns(currentRun.value.id, 2));
    const openBids = computed(() => trackerOpenBidsReplicant!.data!.filter((b) => b.state === 'OPENED'));
    const prizes = computed(() => trackerPrizesReplicant!.data!);

    function getNextRuns(currentRunId: string, i: number) {
        const runDataArray = runDataArrayReplicant!.data!;
        const currentIndex = runDataArray.findIndex((run) => run.id === currentRunId);
        if (currentIndex === -1) {
            return null;
        }
        return runDataArray[currentIndex + i] || null;
    }

    function runnersToString(run: RunData): string {
        return run.teams
            .map((team) => {
                const prefix = team.name ? `${team.name}: ` : '';
                const players = team.players.map((p) => `${p.name}${p.pronouns ? ` (${p.pronouns})` : ''}`).join(' & ');
                return prefix + players;
            })
            .join(' vs. ');
    }

    function getPrizeTimeUntilString(endtime?: string | null) {
        if (!endtime) {
            return 'Donate until the end of the event';
        }
        const prizeEndDate = new Date(endtime);
        const now = new Date();
        const diffMs = prizeEndDate.getTime() - now.getTime();
        switch (true) {
            case diffMs <= 0:
                return 'This prize has ended';
            case diffMs < 60 * 1000: {
                const seconds = Math.floor(diffMs / 1000);
                return seconds > 1 ? `Donate in the next ${seconds} seconds` : 'Donate in the next second';
            }
            case diffMs < 60 * 60 * 1000: {
                const minutes = Math.floor(diffMs / (60 * 1000));
                return minutes > 1 ? `Donate in the next ${minutes} minutes` : 'Donate in the next minute';
            }
            case diffMs < 24 * 60 * 60 * 1000: {
                const hours = Math.floor(diffMs / (60 * 60 * 1000));
                return hours > 1 ? `Donate in the next ${hours} hours` : 'Donate in the next hour';
            }
            default: {
                const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
                return days > 1 ? `Donate in the next ${days} days` : 'Donate in the next day';
            }
        }
    }
</script>

<style scoped>
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        width: 100%;
        padding: 16px;
    }

    .entry {
        width: 100%;
        font-size: 30px;
        padding: 20px 0;
        text-align: center;
        border-bottom: 5px solid white;
    }

    .header {
        font-size: 45px;
        text-align: center;
    }

    .name {
        font-size: 40px;
    }
</style>
