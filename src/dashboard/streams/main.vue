<template>
    <div
        v-for="([stream, slotIdx], i) in twitchStreams"
        :key="i"
    >
        <div class="stream-label">{{ getStreamLabel(i) }}:</div>
        <QBtn
            class="stream-mute"
            dark
            small
            :disable="slotIdx === undefined"
            :title="slotIdx === soundOnTwitchStream?.data ? 'currently unmuted' : 'currently muted'"
            :icon="slotIdx === soundOnTwitchStream?.data ? 'volume_up' : 'volume_off'"
            @click="muteChange(slotIdx)"
        >
        </QBtn>
        <QBtn
            icon="refresh"
            class="stream-refresh"
            dark
            small
            :disable="slotIdx === undefined"
            @click="refresh(slotIdx)"
        >
        </QBtn>
        <QBtn
            class="stream-pause"
            dark
            small
            :disable="slotIdx === undefined"
            :icon="stream.paused ? 'play_arrow' : 'pause'"
            @click="togglePlayPause(slotIdx)"
        >
        </QBtn>
        <div>
            <span>Vol: </span>
            <QSlider
                class="stream-volume"
                :min="0"
                :max="100"
                :model-value="stream.volume * 100"
                :disable="slotIdx === undefined"
                @change="volumeChange(slotIdx, $event)"
            />

            <QLinearProgress
                :color="obsStreamAudioLevels[slotIdx ?? -1] > 95 ? 'red' : 'green'"
                class="stream-volume-multiplier"
                min="0"
                max="100"
                :disable="slotIdx === undefined"
                :value="obsStreamAudioLevels[slotIdx ?? -1] ?? 0"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useHead } from '@unhead/vue';
    import { computed } from 'vue';
    import type { TwitchStream } from '../../../../bingothon-layouts/schemas';
    import {
        obsAudioLevels,
        obsStreamSourceTypeReplicant,
        oldBundle,
        playerSlotsReplicant,
        runDataActiveRunReplicant,
        soundOnTwitchStream,
        streamsReplicant
    } from '../../browser_shared/replicants';

    useHead({ title: '(Twitch) Streams' });

    const twitchStreams = computed(
        () =>
            streamsReplicant?.data?.map((s, sIdx): [TwitchStream, number | undefined] => [
                s,
                playerIdxToSlot.value[sIdx]
            ]) ?? []
    );
    const players = computed(() => runDataActiveRunReplicant?.data?.teams.flatMap((t) => t.players.flat()) ?? []);
    const playerIdxToSlot = computed(() =>
        Object.fromEntries(
            players.value.map((p, pIdx) => {
                const slotIdx = playerSlotsReplicant?.data?.slots.findIndex((s) => s.playerId === p.id);
                return [pIdx, slotIdx === -1 ? undefined : slotIdx];
            })
        )
    );
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
    function volumeChange(id: number | undefined, newVal: number) {
        if (id !== undefined) {
            const newVolume = newVal / 100;
            nodecg.sendMessageToBundle('streams:setStreamVolume', oldBundle, { id, volume: newVolume });
        }
    }

    function muteChange(id: number | undefined) {
        if (id !== undefined) {
            if (soundOnTwitchStream?.data === id) {
                nodecg.sendMessageToBundle('streams:setSoundOnTwitchStream', oldBundle, -1);
            } else {
                nodecg.sendMessageToBundle('streams:setSoundOnTwitchStream', oldBundle, id);
            }
        }
    }

    function togglePlayPause(id: number | undefined) {
        if (id !== undefined) {
            nodecg.sendMessageToBundle('streams:toggleStreamPlayPause', oldBundle, id);
        }
    }

    function refresh(id: number | undefined) {
        if (id !== undefined) {
            nodecg.sendMessageToBundle('streams:refreshStream', oldBundle, id);
        }
    }
</script>

<style>
    .stream-volume-multiplier {
        margin-top: -28px;
        margin-bottom: 10px;
    }
</style>
