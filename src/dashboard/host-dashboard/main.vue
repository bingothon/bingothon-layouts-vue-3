<template>
    <QLayout
        view="lHh Lpr lFf"
        class="fit bg-dark text-white"
    >
        <QHeader
            elevated
            :class="headerClass"
        >
            <div class="donation-total text-h4 text-weight-bold">Donation Total: {{ donationTotal }}</div>
            <QToolbar>
                <QToolbarTitle class="text-subtitle1 text-weight-bold"> Host Dashboard </QToolbarTitle>
            </QToolbar>

            <div
                v-if="showHostsSpeakingBanner"
                class="header-warning text-h5 text-weight-bold"
            >
                <QIcon
                    name="mic"
                    color="white"
                    size="sm"
                    class="q-mr-sm"
                />
                You are currently live on stream
                <QBtn
                    flat
                    dense
                    color="white"
                    icon="mic_off"
                    label="Mute"
                    class="q-ml-md"
                    @click="toggleHostsSpeakingDuringIntermission"
                />
            </div>
            <div
                v-else-if="showAdBanner"
                class="header-warning text-h5 text-weight-bold"
            >
                <QIcon
                    name="info"
                    color="white"
                    size="sm"
                    class="q-mr-sm"
                />
                Playing ads for {{ adTimer }}s
            </div>
            <div
                v-else-if="showVdoBanner"
                class="header-warning text-h5 text-weight-bold"
            >
                <QIcon
                    name="video_chat"
                    color="white"
                    size="sm"
                    class="q-mr-sm"
                />
                VDO overlay is shown on intermission
            </div>

            <QTabs
                v-model="activeTab"
                align="left"
                inline-label
                active-color="white"
                indicator-color="white"
            >
                <QTab
                    name="blurbs"
                    icon="chat"
                    label="Blurbs"
                />
                <QTab
                    name="scheduleAndIncentives"
                    icon="event"
                    label="Schedule & Incentives"
                />
                <QTab
                    name="streamControl"
                    icon="settings"
                    label="Stream Control"
                />
                <QTab
                    name="hostBingo"
                    icon="square"
                    label="Host Bingo"
                />
            </QTabs>
        </QHeader>

        <QPageContainer class="fit">
            <QPage class="fit">
                <QTabPanels
                    v-model="activeTab"
                    animated
                    class="fit bg-transparent"
                >
                    <QTabPanel name="blurbs">
                        <blurbs-tab />
                    </QTabPanel>
                    <QTabPanel name="scheduleAndIncentives">
                        <scheduled-and-incentives-tab />
                    </QTabPanel>
                    <QTabPanel name="streamControl">
                        <stream-control-tab />
                    </QTabPanel>
                    <QTabPanel name="hostBingo">
                        <host-bingo-tab
                            :is-restream="false"
                            font-size="25px"
                        />
                    </QTabPanel>
                </QTabPanels>
            </QPage>
        </QPageContainer>
    </QLayout>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { formatAmount } from '../../browser_shared/formatAmount';
    import {
        donationTotalReplicant,
        hostsSpeakingDuringIntermissionReplicant,
        showThingsDuringIntermissionReplicant,
        twitchCommercialTimerReplicant
    } from '../../browser_shared/replicants';
    import BlurbsTab from './components/blurbsTab.vue';
    import ScheduledAndIncentivesTab from './components/scheduledAndIncentivesTab.vue';
    import StreamControlTab from './components/streamControlTab.vue';
    import HostBingoTab from './components/hostBingoTab.vue';

    const activeTab = ref('blurbs');
    const donationTotal = computed(() => formatAmount(donationTotalReplicant?.data || 0));

    const adTimer = computed(() => twitchCommercialTimerReplicant?.data?.secondsRemaining ?? 0);
    const showAdBanner = computed(() => adTimer.value > 0);
    const showHostsSpeakingBanner = computed(() => hostsSpeakingDuringIntermissionReplicant?.data?.speaking || false);
    // Use oldData to check if the replicant actually got updated and not just the model
    const showVdoBanner = computed(() => !!showThingsDuringIntermissionReplicant?.oldData?.vdoUrl || '');

    const headerClass = computed(() => {
        if (showHostsSpeakingBanner.value) return 'bg-red';
        if (showAdBanner.value) return 'bg-orange';
        if (showVdoBanner.value) return 'bg-green';
        return 'bg-primary';
    });

    function toggleHostsSpeakingDuringIntermission() {
        hostsSpeakingDuringIntermissionReplicant!.data!.speaking =
            !hostsSpeakingDuringIntermissionReplicant!.data!.speaking;
        hostsSpeakingDuringIntermissionReplicant?.save();
    }
</script>

<style scoped>
    .fit {
        width: 100%;
        height: 100vh;
    }

    .donation-total {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
    }

    .header-warning {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        white-space: nowrap;
    }
</style>

<style>
    #HostingBingo .bingo-table {
        width: 500px;
        height: 500px;
    }
    #HostingBingo {
        height: 600px;
    }
</style>
