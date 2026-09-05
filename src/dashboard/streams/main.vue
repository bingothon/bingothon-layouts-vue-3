<template>
    <div
        v-for="(stream, i) in twitchStreams"
        :key="i"
    >
        <div class="stream-label">{{ getStreamLabel(i) }}:</div>
        <QBtn
            class="stream-mute"
            dark
            small
            :title="i === soundOnTwitchStream?.data ? 'currently unmuted' : 'currently muted'"
            :icon="i === soundOnTwitchStream?.data ? 'volume_up' : 'volume_off'"
            @click="muteChange(i)"
        >
        </QBtn>
        <QBtn
            icon="refresh"
            class="stream-refresh"
            dark
            small
            @click="refresh(i)"
        >
        </QBtn>
        <QBtn
            class="stream-pause"
            dark
            small
            :icon="stream.paused ? 'play_arrow' : 'pause'"
            @click="togglePlayPause(i)"
        >
        </QBtn>
        <div>
            <span>Vol: </span>
            <QSlider
                class="stream-volume"
                :min="0"
                :max="100"
                :model-value="stream.volume * 100"
                @change="volumeChange(i, $event)"
            />

            <QLinearProgress
                :color="obsStreamAudioLevels[i] > 95 ? 'red' : 'green'"
                class="stream-volume-multiplier"
                min="0"
                max="100"
                :value="obsStreamAudioLevels[i]"
            />
        </div>
        <div>Edit player in Run Modifications</div>
    </div>
</template>

<script setup lang="ts">
    import { useHead } from '@unhead/vue';
    import { computed } from 'vue';
    import {
        obsAudioLevels,
        obsStreamSourceTypeReplicant,
        oldBundle,
        runDataActiveRunReplicant,
        soundOnTwitchStream,
        streamsReplicant
    } from '../../browser_shared/replicants';

    useHead({ title: '(Twitch) Streams' });

    const twitchStreams = computed(() => streamsReplicant?.data ?? []);
    const players = computed(() => runDataActiveRunReplicant?.data?.teams.flatMap((t) => t.players.flat()) ?? []);
    const obsStreamAudioLevels = computed(() =>
        twitchStreams.value.map((_, idx) => {
            const sourceName =
                obsStreamSourceTypeReplicant?.data === 'obsTwitchPlayer'
                    ? `twitch-stream-${idx}`
                    : `media-stream-${idx}`;
            return obsAudioLevels?.data?.[sourceName]?.volume ?? 0;
        })
    );

    const getStreamLabel = computed(() => (idx: number) => {
        const stream = streamsReplicant?.data?.[idx];
        const channelName =
            obsStreamSourceTypeReplicant?.data === 'obsSrtMediasource' ? stream?.srtChannel : stream?.channel;
        return `${idx}: ${players.value[idx].name} (${channelName})`;
    });
    function volumeChange(id: number, newVal: number) {
        const newVolume = newVal / 100;
        nodecg.sendMessageToBundle('streams:setStreamVolume', oldBundle, { id, volume: newVolume });
    }

    function muteChange(id: number) {
        if (soundOnTwitchStream?.data === id) {
            nodecg.sendMessageToBundle('streams:setSoundOnTwitchStream', oldBundle, -1);
        } else {
            nodecg.sendMessageToBundle('streams:setSoundOnTwitchStream', oldBundle, id);
        }
    }

    function togglePlayPause(id: number) {
        nodecg.sendMessageToBundle('streams:toggleStreamPlayPause', oldBundle, id);
    }

    function refresh(id: number) {
        nodecg.sendMessageToBundle('streams:refreshStream', oldBundle, id);
    }
</script>

<style>
    .stream-volume-multiplier {
        margin-top: -28px;
        margin-bottom: 10px;
    }
</style>
