<template>
    <div
        v-if="bid"
        id="Bid"
    >
        <div class="Header">
            <span v-if="bid.goal"> Upcoming Goal </span>
            <span v-else> Upcoming Bid War </span>
        </div>
        <div class="incentive-container">
            <div class="RunName">{{ bid.game }}</div>
            <div class="BidName">
                {{ bid.bid }}
            </div>

            <div
                v-if="bid.goal != null"
                class="BidAmount"
            >
                <div id="progressbar">
                    <div
                        id="progress"
                        :style="{ width: percentRaised(bid) + '%' }"
                    ></div>
                    <div id="amount">{{ formatAmount(bid.amount_raised) }}/{{ formatAmount(bid.goal) }}</div>
                </div>
            </div>
            <div
                v-else-if="Object.keys(bid.options).length === 0"
                class="BidAmount"
            >
                <div v-if="bid.options.length">
                    <div v-if="bid.allow_custom_options">...or you could submit your own idea!</div>
                </div>
                <div v-else-if="bid.allow_custom_options">No options submitted yet, be the first!</div>
            </div>
            <div
                v-else
                class="BidAmount"
            >
                <div class="bid-graphics">
                    <apexChart
                        type="bar"
                        height="400"
                        width="100%"
                        :options="chartOptions"
                        :series="chartSeries"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import clone from 'clone';
    import apexChart from 'vue3-apexcharts';
    import { formatAmount } from '../../../../browser_shared/formatAmount';
    import { computed, defineEmits, onMounted, ref, watch } from 'vue';
    import { trackerOpenBidsReplicant } from '../../../../browser_shared/replicants.ts';
    import type { TrackerOpenBids } from '../../../../../../bingothon-layouts/schemas/trackerOpenBids';
    import type { ApexOptions } from 'apexcharts';

    type TrackerOpenBid = TrackerOpenBids[0];

    const bid = ref<TrackerOpenBid | null>(null);

    const emit = defineEmits(['end']);

    const processedData = computed(() => {
        if (!bid.value?.options) return [];

        return (
            bid.value.options
                .map((option) => ({
                    name: option.name,
                    value: option.amount_raised
                }))
                .sort((a, b) => a.value - b.value)
                // Only choose the 5 highest options
                .slice(0, 5)
        );
    });

    const chartSeries = computed(() => [
        {
            name: 'Amount Raised',
            data: processedData.value.map((d) => d.value)
        }
    ]);

    const chartOptions = computed<ApexOptions>(() => ({
        chart: {
            toolbar: { show: false },
            animations: { enabled: true }
        },
        plotOptions: {
            bar: {
                horizontal: true, // Turns it into a horizontal bar chart
                distributed: true, // Assigns independent colors per bar rather than per series
                barHeight: '80%',
                dataLabels: {
                    position: 'absolute' // Places value text elements relative to the bar edge
                }
            }
        },
        // Direct conversion of your original D3 hex color array configuration
        colors: ['#3f84e5', '#faa300', '#f63e02', '#a41623', '#2f4858'],
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            offsetX: 10, // Pushes text labels 10px to the right of the bar edge
            style: {
                colors: ['#ffffff'], // Crisp white label colors
                fontSize: '14px',
                fontWeight: 'bold'
            },
            formatter: function (val: number) {
                return formatAmount(val);
            }
        },
        xaxis: {
            categories: processedData.value.map((d) => d.name),
            labels: {
                show: false // Hides redundant x-axis baseline ticks, relying on labels next to bars
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            max:
                processedData.value.length > 0 ? Math.max(...processedData.value.map((d) => d.value)) * 1.15 : undefined
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#ffffff', // Ensures long option labels stand out on dark layouts
                    fontSize: '14px'
                }
            }
        },
        grid: { show: false, padding: { right: 80 } },
        legend: { show: false }, // Disables structural legend boxes below
        tooltip: { enabled: false }
    }));

    onMounted(() => {
        function setBid(chosenBid: TrackerOpenBid) {
            bid.value = clone(chosenBid);
            setTimeout(() => emit('end'), 20 * 1000);
        }

        // Check if the replicant has loaded
        const isReplicantReady = trackerOpenBidsReplicant && trackerOpenBidsReplicant.data;

        if (isReplicantReady) {
            // If the replicant has loaded, we can immediately choose a bid.
            const chosenBid = getRandomBid();

            if (chosenBid) {
                setBid(chosenBid);
            } else {
                // There is no valid bid left, so we skip the rotation
                emit('end');
            }
        } else {
            // The replicant hasn't loaded yet, so we need to watch until it loads
            const unwatch = watch(
                () => trackerOpenBidsReplicant?.data,
                (openBids) => {
                    if (!openBids) return;

                    const chosenBid = getRandomBid();
                    if (chosenBid) {
                        setBid(chosenBid);
                    } else {
                        // There is no valid bid left, so we skip the rotation
                        emit('end');
                    }
                    unwatch();
                },
                { deep: true }
            );
        }
    });

    function percentRaised(bid: TrackerOpenBid) {
        if (bid.amount_raised >= bid.goal!) {
            return 100;
        }
        const percent = bid.goal! / 100;
        return bid?.amount_raised / percent || 0;
    }

    function getRandomBid(): TrackerOpenBid | null {
        if (!trackerOpenBidsReplicant?.data) return null;
        const openBids = trackerOpenBidsReplicant?.data.filter((bid) => {
            // goal is null for bid wars
            if (bid.goal == null) {
                // bid wars are closed manually
                return bid.state == 'OPENED';
            } else {
                // Incentives close as soon as the needed amount is reached
                // we still want to display them until the run starts
                return !bid.run_started;
            }
        });

        if (openBids.length) {
            return openBids[Math.floor(Math.random() * openBids.length)];
        } else {
            return null;
        }
    }
</script>

<style>
    #progressbar {
        position: absolute;
        display: flex;
        top: 300px;
        left: 133px;
        width: 900px;
        background-color: rgba(0, 0, 0, 0);
        border: 2px var(--container-border-color) solid;
        height: 100px;
        align-content: end;
    }
    #amount {
        position: absolute;
        display: flex;
        height: 100px;
        left: 0px;
        z-index: 6;
        align-content: center;
        align-self: center;
        align-items: center;
        justify-content: center;
    }
    #progress {
        top: 0px;
        left: 0px;
        position: absolute;
        height: 100px;
        background-image: linear-gradient(#2f6faf, #235589);
        z-index: 5;
    }
    #goal {
        position: absolute;
        left: 1000px;
        top: 325px;
    }
    #Bid {
        position: absolute;
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
    }
    #Bid > .Header {
        width: 100%;
        font-weight: 500;
        height: 60px;
        line-height: 60px;
        //background-color: var(--border-colour);
        color: white;
        font-size: 41px;
        text-transform: uppercase;
    }
    #Bid > .incentive-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        background-color: rgba(0, 0, 0, 0.3);
        overflow: hidden;
    }
    #Bid > .incentive-container > div {
        margin: 10px;
    }
    #Bid > .incentive-container > .RunName {
        font-size: 45px;
    }
    #Bid > .incentive-container > .BidName {
        font-size: 32px;
    }
    #Bid > .incentive-container > .BidAmount {
        height: 445px;
        font-size: 40px;
    }
    svg {
        font-size: 25px;
        color: white;
    }
    .arc text {
        text-anchor: middle;
    }

    g.tick,
    .label {
        font-size: 25px;
        fill: #fff;
    }

    path.domain {
        fill: none;
        display: none;
    }

    .bid-graphics {
        width: 1172px;
        height: 400px;
    }
</style>
