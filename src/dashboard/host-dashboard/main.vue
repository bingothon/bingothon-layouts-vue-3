<template>
    <QLayout
        view="lHh Lpr lFf"
        class="fit bg-dark text-white"
    >
        <QHeader
            elevated
            class="bg-primary"
            style="position: relative"
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
                    name="general"
                    icon="settings"
                    label="General"
                />
                <QTab
                    name="scheduleAndIncentives"
                    icon="event"
                    label="Schedule & Incentives"
                />
                <!--                <QTab
                    name="lowerthirds"
                    icon="video_label"
                    label="Lower Thirds"
                />
                <QTab
                    name="roster"
                    icon="groups"
                    label="Roster"
                />-->
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
                    <QTabPanel
                        name="general"
                        class="q-pa-md"
                    >
                        <div class="text-h6 q-mb-md">General Settings</div>
                        <QInput
                            v-model="streamTitle"
                            label="Stream Title"
                            outlined
                            dark
                            class="q-mb-md"
                            dense
                        />
                        <QBtn
                            color="primary"
                            icon="save"
                            label="Update Title"
                            unelevated
                            @click="updateTitle"
                        />
                    </QTabPanel>

                    <QTabPanel
                        name="lowerthirds"
                        class="q-pa-md"
                    >
                        <div class="text-h6 q-mb-md">Lower Third Controls</div>
                        <QInput
                            v-model="ltName"
                            label="Name"
                            outlined
                            dark
                            class="q-mb-sm"
                            dense
                        />
                        <QInput
                            v-model="ltRole"
                            label="Role"
                            outlined
                            dark
                            class="q-mb-md"
                            dense
                        />

                        <QSeparator
                            dark
                            class="q-my-md"
                        />

                        <div class="row q-gutter-sm">
                            <QBtn
                                color="positive"
                                icon="visibility"
                                label="In"
                                unelevated
                                @click="showLT"
                            />
                            <QBtn
                                color="negative"
                                icon="visibility_off"
                                label="Out"
                                unelevated
                                @click="hideLT"
                            />
                        </div>
                    </QTabPanel>

                    <QTabPanel
                        name="roster"
                        class="q-pa-md"
                    >
                        <div class="text-h6 q-mb-md">Team Roster</div>
                        <QBanner class="bg-grey-9 rounded-borders">
                            <template #avatar>
                                <QIcon
                                    name="info"
                                    color="primary"
                                />
                            </template>
                            Roster management logic goes here.
                        </QBanner>
                    </QTabPanel>
                    <QTabPanel
                        name="scheduleAndIncentives"
                        class="q-pa-md"
                    >
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
    import StreamControlTab from './components/streamControlTab.vue';
    import ScheduledAndIncentivesTab from './components/scheduledAndIncentivesTab.vue';

    const activeTab = ref('blurbs');
    const donationTotal = computed(() => formatAmount(donationTotalReplicant?.data || 0));
    const streamTitle = ref('My Awesome Tournament');
    const ltName = ref('');
    const ltRole = ref('');

    const updateTitle = () => console.log('Updating Title:', streamTitle.value);
    const showLT = () => console.log('Show LT');
    const hideLT = () => console.log('Hide LT');
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
