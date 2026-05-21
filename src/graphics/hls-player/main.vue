<template>
    <video
        id="video"
        ref="video"
    ></video>
    <span
        v-show="showDelayDebug"
        id="video-delay"
        >Delay: {{ hlsLatency.toFixed(2) }}</span
    >
</template>

<script setup lang="ts">
    import Hls from 'hls.js';
    import { computed, onUnmounted, ref, useTemplateRef, watch } from 'vue';
    import { discordDelayInfo, oldBundle, streamsReplicant } from '../../browser_shared/replicants';

    const hls = new Hls({
        lowLatencyMode: true,
        maxLiveSyncPlaybackRate: nodecg.bundleConfig.hlsPlayer?.maxLiveSyncPlaybackRate ?? 10
    });

    const videoElem = useTemplateRef<HTMLVideoElement>('video');

    const streamIdx = parseInt(new URLSearchParams(location.search).get('stream') ?? '0');
    const streamChannel = computed(() => {
        return streamsReplicant?.data?.[streamIdx]?.channel;
    });

    watch(
        () => streamChannel.value,
        () => {
            NodeCG.sendMessageToBundle(
                'streams:getUrlForStream',
                oldBundle,
                { stream: streamChannel.value },
                (response) => {
                    if (typeof response === 'string') {
                        hls.loadSource(response);
                        hls.attachMedia(videoElem.value!);
                        hls.targetLatency = (discordDelayInfo?.data?.streamDelayMs ?? 4000) / 1000;
                        videoElem.value?.play();
                    }
                }
            );
        }
    );

    watch(
        () => discordDelayInfo?.data?.streamDelayMs,
        () => {
            hls.targetLatency = (discordDelayInfo?.data?.streamDelayMs ?? 4000) / 1000;
        }
    );

    const showDelayDebug = nodecg.bundleConfig.hlsPlayer?.delayDebug === true;

    const hlsLatency = ref(hls.latency);

    const latencyInterval = setInterval(() => {
        hlsLatency.value = hls.latency;
    }, 1000);

    onUnmounted(() => {
        clearInterval(latencyInterval);
    });
</script>

<style>
    #video {
        height: 1080px;
        width: 1920px;
        position: absolute;
    }
    #video-delay {
        font-size: 50px;
        position: absolute;
        color: black;
        /* make sure the text is always readable */
        text-shadow: white 0px 50px;
    }
</style>
