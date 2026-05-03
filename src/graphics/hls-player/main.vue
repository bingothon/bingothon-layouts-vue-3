<script setup lang="ts">
    import Hls from 'hls.js';
    import { computed, onUnmounted, useTemplateRef, watch } from 'vue';
    import { oldBundle, streamsReplicant } from '../../browser_shared/replicants';

    const hls = new Hls({
        lowLatencyMode: true,
        maxLiveSyncPlaybackRate: 1.2
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
                        hls.targetLatency = 7;
                        videoElem.value?.play();
                    }
                    console.log('got', response);
                }
            );
        }
    );

    function doPlay() {
        videoElem.value?.play();
    }

    const latencyInterval = setInterval(() => {
        console.log(`delay: ${hls.latency}`);
    }, 5000);

    onUnmounted(() => {
        clearInterval(latencyInterval);
    });
</script>

<template>
    <button @click="doPlay()">play</button>
    <video ref="video"></video>
</template>
