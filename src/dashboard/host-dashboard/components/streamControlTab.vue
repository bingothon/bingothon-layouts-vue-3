<template>
    <QBanner
        v-if="showAdBanner"
        class="bg-orange text-white rounded-borders q-mb-md"
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
        v-if="showHostsSpeakingBanner"
        inline-actions
        class="text-white bg-red rounded-borders q-mb-md"
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
                @click="toggleHostsSpeakingDuringIntermission"
            />
        </template>
    </QBanner>
    <QBanner
        v-if="showVdoBanner"
        inline-actions
        class="text-white bg-green rounded-borders q-mb-md"
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
    <QBtn
        color="red"
        :icon="hostsSpeakingDuringIntermission ? 'mic_off' : 'mic'"
        :label="hostsSpeakingToggleButtonText"
        unelevated
        class="q-mb-md"
        :disabled="!hostsCanGoLive"
        @click="toggleHostsSpeakingDuringIntermission"
    />
    <div class="row items-center q-gutter-sm q-mb-md">
        <QIcon
            name="image"
            color="white"
            size="sm"
        />
        <div class="text-h6">Show an image on stream</div>
    </div>
    <QInput
        v-model="showThingsDuringIntermissionReplicant!.data!.imageUrl"
        label="Paste the entire image URL here"
        outlined
        dark
        class="q-mb-md"
        dense
    />
    <QBtn
        color="primary"
        icon="save"
        label="Show image"
        unelevated
        class="q-mb-md q-mr-sm"
        @click="saveImage"
    />
    <QBtn
        color="primary"
        icon="settings_backup_restore"
        label="Reset image"
        unelevated
        class="q-mb-md"
        @click="resetShowThingsDuringIntermission"
    />
    <div class="row items-center q-gutter-sm q-mb-md">
        <QIcon
            name="video_library"
            color="white"
            size="sm"
        />
        <div class="text-h6">Play a Twitch clip during intermission</div>
    </div>
    <QInput
        v-model="twitchClipUrl"
        label="Paste the full Twitch Clip URL here"
        outlined
        dark
        class="q-mb-md"
        dense
    />
    <QBtn
        color="primary"
        icon="play_circle"
        label="Play clip"
        unelevated
        class="q-mb-md q-mr-sm"
        @click="startTwitchClip"
    />
    <QBtn
        color="primary"
        icon="stop_circle"
        label="Stop clip"
        unelevated
        class="q-mb-md"
        @click="stopTwitchClip"
    />
    <div class="row items-center q-gutter-sm q-mb-md">
        <QIcon
            name="video_chat"
            color="white"
            size="sm"
        />
        <div class="text-h6">Paste a VDO Ninja room during intermission</div>
    </div>
    <QInput
        v-model="twitchClipUrl"
        label="Paste the entire URL of the group scene here"
        outlined
        dark
        class="q-mb-md"
        dense
    />
    <QBtn
        color="primary"
        icon="save"
        label="Show VDO"
        unelevated
        class="q-mb-md q-mr-sm"
        @click="saveVDO"
    />
    <QBtn
        color="primary"
        icon="settings_backup_restore"
        label="Reset VDO"
        unelevated
        class="q-mb-md"
        @click="resetShowThingsDuringIntermission"
    />
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import {
        hostsSpeakingDuringIntermissionReplicant,
        obsCurrentSceneReplicant,
        oldBundle,
        showThingsDuringIntermissionReplicant,
        twitchCommercialTimerReplicant
    } from '../../../browser_shared/replicants.ts';

    const adTimer = computed(() => twitchCommercialTimerReplicant!.data!.secondsRemaining);
    const vdoUrl = computed(() => showThingsDuringIntermissionReplicant!.data!.vdoUrl);
    const showAdBanner = computed<boolean>(() => adTimer.value > 0);
    const showHostsSpeakingBanner = computed<boolean>(() => hostsSpeakingDuringIntermission.value);
    const showVdoBanner = computed<boolean>(() => !!vdoUrl.value);
    const twitchClipUrl = ref('');

    const twitchClipSlug = computed(() => {
        const urlParts = twitchClipUrl.value.split('/');
        if (twitchClipUrl.value.includes('clips.twitch.tv')) {
            // For URLs like https://clips.twitch.tv/AwkwardScaryAniseKappaWealth
            return urlParts.pop(); // Gets the last segment after the last '/'
        } else if (twitchClipUrl.value.includes('twitch.tv') && urlParts.includes('clip')) {
            // For URLs like https://www.twitch.tv/bingothon/clip/SparklingToughFriesRuleFive
            return urlParts[urlParts.indexOf('clip') + 1]; // Gets the segment after 'clip'
        }
        return ''; // Default return if the URL doesn't match expected formats
    });

    const hostsSpeakingDuringIntermission = computed<boolean>(
        () => hostsSpeakingDuringIntermissionReplicant!.data!.speaking
    );

    // only during intermission
    const hostsCanGoLive = computed<boolean>(() => {
        return obsCurrentSceneReplicant?.data == 'intermission' && adTimer.value <= 0;
    });

    const hostsSpeakingToggleButtonText = computed<string>(() => {
        if (!hostsCanGoLive.value) {
            if (hostsSpeakingDuringIntermission.value) {
                toggleHostsSpeakingDuringIntermission();
            }
            return '(Disabled)';
        } else if (hostsSpeakingDuringIntermission.value) {
            return 'Mute';
        } else {
            return 'Unmute on stream';
        }
    });

    function toggleHostsSpeakingDuringIntermission() {
        hostsSpeakingDuringIntermissionReplicant!.data!.speaking =
            !hostsSpeakingDuringIntermissionReplicant!.data!.speaking;
        hostsSpeakingDuringIntermissionReplicant?.save();
    }

    function saveImage() {
        // Clear the VDO URL to ensure only one of them is shown at a time
        showThingsDuringIntermissionReplicant!.data!.vdoUrl = '';
        showThingsDuringIntermissionReplicant?.save();
    }

    function saveVDO() {
        // Clear the image URL to ensure only one of them is shown at a time
        showThingsDuringIntermissionReplicant!.data!.imageUrl = '';
        showThingsDuringIntermissionReplicant?.save();
    }

    function resetShowThingsDuringIntermission() {
        showThingsDuringIntermissionReplicant!.data!.imageUrl = '';
        showThingsDuringIntermissionReplicant!.data!.vdoUrl = '';
        showThingsDuringIntermissionReplicant?.save();
    }

    function startTwitchClip() {
        nodecg.sendMessageToBundle('playTwitchClip', oldBundle, twitchClipSlug.value);
    }

    function stopTwitchClip() {
        nodecg.sendMessageToBundle('stopTwitchClip', oldBundle);
    }
</script>

<style scoped></style>
