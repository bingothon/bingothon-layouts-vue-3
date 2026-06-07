<template>
    <div
        v-if="prize"
        id="Prize"
    >
        <div class="Header">Prize Available</div>
        <div class="Body">
            <img
                v-if="prize.image"
                class="Image"
                :src="prize.image"
            />
            <div class="Title">{{ prize.name }} provided by {{ prize.provider }}</div>
            <div class="MinAmount">Minimum donation amount: {{ formatAmount(prize.minDonation!) }}</div>
            <div class="Deadline">
                {{ getPrizeTimeUntilString(prize) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import clone from 'clone';
    import { timeUntilString } from '../../../../browser_shared/timeUntilString.ts';
    import { formatAmount } from '../../../../browser_shared/formatAmount.ts';
    import type { TrackerPrizes } from '../../../../../../bingothon-layouts/schemas/trackerPrizes';
    import { onMounted, ref, watch } from 'vue';
    import { trackerPrizesReplicant } from '../../../../browser_shared/replicants.ts';

    type TrackerPrize = TrackerPrizes[0];

    const emit = defineEmits(['end']);

    const prize = ref<TrackerPrize | null>(null);

    onMounted(() => {
        function setPrize(chosenPrize: TrackerPrize) {
            prize.value = clone(chosenPrize);
            setTimeout(() => emit('end'), 20 * 1000);
        }

        // Check if the replicant has loaded
        const isReplicantReady = trackerPrizesReplicant && trackerPrizesReplicant.data;

        if (isReplicantReady) {
            // If the replicant has loaded, we can immediately choose a prize.
            const chosenPrize = getRandomPrize();

            if (chosenPrize) {
                setPrize(chosenPrize);
            } else {
                // There is no valid prize left, so we skip the rotation
                emit('end');
            }
        } else {
            // The replicant hasn't loaded yet, so we need to watch until it loads
            const unwatch = watch(
                () => trackerPrizesReplicant?.data,
                (prizes) => {
                    if (!prizes) return;

                    const chosenPrize = getRandomPrize();
                    if (chosenPrize) {
                        setPrize(chosenPrize);
                    } else {
                        // There is no valid prize left, so we skip the rotation
                        emit('end');
                    }
                    unwatch();
                },
                { deep: true }
            );
        }
    });

    function getPrizeTimeUntilString(prize: TrackerPrize) {
        if (prize.endtime) {
            const untilString = timeUntilString(prize.endtime, true).toLocaleLowerCase();
            return `Donate ${untilString}`;
        } else {
            return `Donate until the end of the event`;
        }
    }

    function getRandomPrize(): TrackerPrize | null {
        if (!trackerPrizesReplicant?.data) return null;
        const now = Date.now();
        const prizes = trackerPrizesReplicant?.data.filter((prize) => {
            return (
                (!prize.endtime || new Date(prize.endtime).getTime() > now) &&
                (!prize.starttime || new Date(prize.starttime).getTime() <= now)
            );
        });

        if (!prizes.length) {
            return null;
        }
        const randNum = Math.floor(Math.random() * prizes.length);
        return prizes[randNum];
    }
</script>

<style>
    #Prize {
        position: absolute;
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
    }
    #Prize > .Header {
        width: 100%;
        font-weight: 500;
        height: 60px;
        line-height: 60px;
        background-color: var(--border-colour);
        color: white;
        font-size: 41px;
        text-transform: uppercase;
    }
    #Prize > .Body {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        font-size: 41px;
        background-color: rgba(0, 0, 0, 0.3);
    }
    #Prize > .Body > .Image {
        height: 400px;
        object-fit: contain;
    }
    #Prize > .Body > .Title {
        font-size: 40px;
    }
    #Prize > .Body > .MinAmount {
        font-size: 30px;
    }
    #Prize > .Body > .Deadline {
        font-size: 30px;
    }
</style>
