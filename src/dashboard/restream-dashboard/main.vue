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
                    <QTabPanel name="hostBingo">
                        <host-bingo-tab
                            :is-restream="true"
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
    import { donationTotalReplicant } from '../../browser_shared/replicants';
    import BlurbsTab from '../host-dashboard/components/blurbsTab.vue';
    import ScheduledAndIncentivesTab from '../host-dashboard/components/scheduledAndIncentivesTab.vue';
    import HostBingoTab from '../host-dashboard/components/hostBingoTab.vue';

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
