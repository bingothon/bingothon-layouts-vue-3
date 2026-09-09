<template>
    <div
        v-for="(stream, slotIdx) in twitchStreamsBySlot"
        :key="slotIdx"
        class="q-mb-lg"
    >
        <template v-if="stream">
            <div>{{ getStreamLabel(stream) }}:</div>
            <QBtnGroup push>
                <QBtn
                    dark
                    small
                    :title="slotIdx === soundOnTwitchStream?.data ? 'currently unmuted' : 'currently muted'"
                    :icon="slotIdx === soundOnTwitchStream?.data ? 'volume_up' : 'volume_off'"
                    @click="muteChange(slotIdx)"
                >
                </QBtn>
                <QBtn
                    icon="refresh"
                    dark
                    small
                    @click="refresh(slotIdx)"
                >
                </QBtn>
                <QBtn
                    dark
                    small
                    :icon="stream.paused ? 'play_arrow' : 'pause'"
                    @click="togglePlayPause(slotIdx)"
                >
                </QBtn>
            </QBtnGroup>
            <div class="row no-wrap flex-center">
                <div>
                    <QIcon
                        size="md"
                        name="volume_up"
                    />
                </div>
                <QSlider
                    class="q-ml-sm"
                    :min="0"
                    :max="100"
                    :model-value="stream.volume * 100"
                    @change="volumeChange(slotIdx, $event)"
                />
            </div>
            <QLinearProgress
                :color="obsStreamAudioLevels[slotIdx] > 95 ? 'red' : 'green'"
                min="0"
                max="100"
                :value="obsStreamAudioLevels[slotIdx] ?? 0"
            />
        </template>
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

    const twitchStreamsBySlot = computed(
        () =>
            playerSlotsReplicant?.data?.slots.map((slot) =>
                streamsReplicant?.data?.find((s) => s.playerId === slot.playerId)
            ) ?? []
    );
    const players = computed(() => runDataActiveRunReplicant?.data?.teams.flatMap((t) => t.players.flat()) ?? []);

    const obsStreamAudioLevels = computed(() =>
        twitchStreamsBySlot.value.map((_, idx) => {
            const sourceName =
                obsStreamSourceTypeReplicant?.data === 'obsTwitchPlayer'
                    ? `twitch-stream-${idx}`
                    : `media-stream-${idx}`;
            return obsAudioLevels?.data?.[sourceName]?.volume ?? 0;
        })
    );

    const getStreamLabel = computed(() => (stream: TwitchStream) => {
        const channelName =
            obsStreamSourceTypeReplicant?.data === 'obsSrtMediasource' ? stream?.srtChannel : stream?.channel;
        const playerName = players.value.find((p) => p.id === stream.playerId)?.name;
        return `${playerName} (${channelName})`;
    });
    function volumeChange(id: number | undefined, newVal: number) {
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

    function togglePlayPause(id: number | undefined) {
        nodecg.sendMessageToBundle('streams:toggleStreamPlayPause', oldBundle, id);
    }

    function refresh(id: number | undefined) {
        nodecg.sendMessageToBundle('streams:refreshStream', oldBundle, id);
    }
</script>

<style></style>
