<template>
    <QLayout
        view="lHh Lpr lFf"
        class="fit bg-dark text-white"
    >
        <QHeader
            elevated
            class="bg-primary"
        >
            <div class="donation-total text-h4 text-weight-bold">Donation Total: {{ donationTotal }}</div>
            <QToolbar>
                <QToolbarTitle class="text-subtitle1 text-weight-bold"> Host Dashboard </QToolbarTitle>
            </QToolbar>

            <QTabs
                v-model="activeTab"
                align="left"
                inline-label
                active-color="white"
                indicator-color="secondary"
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
                        <!-- TODO: Add Component for Host Bingo -->
                    </QTabPanel>
                </QTabPanels>
            </QPage>
        </QPageContainer>
    </QLayout>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { formatAmount } from '../../browser_shared/formatAmount';
    import { donationTotalReplicant } from '../../browser_shared/replicants';
    import BlurbsTab from './components/blurbsTab.vue';
    import ScheduledAndIncentivesTab from './components/scheduledAndIncentivesTab.vue';
    import StreamControlTab from './components/streamControlTab.vue';

    const activeTab = ref('blurbs');
    const donationTotal = computed(() => formatAmount(donationTotalReplicant?.data || 0));
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
</style>
