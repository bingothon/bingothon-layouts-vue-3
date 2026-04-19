<template>
    <QLayout
        view="lHh Lpr lFf"
        class="fit bg-dark text-white"
    >
        <QHeader
            elevated
            class="bg-primary"
        >
            <QToolbar>
                <QToolbarTitle class="text-subtitle1 text-weight-bold"> Stream Control Center </QToolbarTitle>
            </QToolbar>

            <QTabs
                v-model="activeTab"
                align="left"
                inline-label
                active-color="white"
                indicator-color="secondary"
            >
                <QTab
                    name="general"
                    icon="settings"
                    label="General"
                />
                <QTab
                    name="lowerthirds"
                    icon="video_label"
                    label="Lower Thirds"
                />
                <QTab
                    name="roster"
                    icon="groups"
                    label="Roster"
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
                </QTabPanels>
            </QPage>
        </QPageContainer>
    </QLayout>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const activeTab = ref('general');
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
</style>
