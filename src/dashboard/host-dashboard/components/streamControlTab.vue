<template>
    <div class="q-pa-md">
        <!--        <div class="text-h6 q-mb-md">Team Roster</div>-->
        <QBanner
            v-if="adTimer > 0"
            class="bg-orange text-white rounded-borders"
        >
            <template #avatar>
                <QIcon
                    name="info"
                    color="white"
                />
            </template>
            Currently playing ads for {{ adTimer }} more seconds
        </QBanner>
        <QBanner
            v-if="hostsSpeakingDuringIntermission"
            inline-actions
            class="text-white bg-red rounded-borders"
        >
            <template #avatar>
                <QIcon
                    name="mic"
                    color="white"
                />
            </template>
            You are currently live on stream
            <template #action>
                <QBtn
                    flat
                    color="white"
                    icon="mic_off"
                    label="Mute"
                />
            </template>
        </QBanner>
        <QBanner
            v-if="!!vdoUrl"
            inline-actions
            class="text-white bg-green rounded-borders"
        >
            <template #avatar>
                <QIcon
                    name="video_chat"
                    color="white"
                />
            </template>
            The VDO overlay is currently shown on the intermission layout!
            <template #action>
                <QBtn
                    flat
                    color="white"
                    icon="stop_circle"
                    label="Stop"
                />
            </template>
        </QBanner>
    </div>
</template>

<script setup lang="ts">
    import {
        hostsSpeakingDuringIntermissionReplicant,
        showThingsDuringIntermissionReplicant,
        twitchCommercialTimerReplicant
    } from '../../../browser_shared/replicants.ts';
    import { computed } from 'vue';

    const adTimer = computed(() => twitchCommercialTimerReplicant!.data!.secondsRemaining);
    const hostsSpeakingDuringIntermission = computed(() => hostsSpeakingDuringIntermissionReplicant!.data!.speaking);
    const vdoUrl = computed(() => showThingsDuringIntermissionReplicant!.data!.vdoUrl);
</script>

<style scoped></style>
