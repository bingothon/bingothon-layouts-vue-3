<template>
    <div>
        <QSelect
            v-model="currentChannel"
            :options="channelChoices"
            :dense="true"
            style="max-width: 300px; padding-bottom: 20px"
        >
        </QSelect>
        <div
            ref="resizeContainer"
            class="ResizeContainer"
        >
            <div
                ref="twitchPlayer"
                class="TwitchPlayer"
            />
            <div
                class="Draggable DraggableTop"
                @mousedown="resizeTopMousedownHandler"
            ></div>
            <div
                class="Draggable DraggableBottom"
                @mousedown="resizeBottomMousedownHandler"
            ></div>
            <div
                class="Draggable DraggableLeft"
                @mousedown="resizeLeftMousedownHandler"
            ></div>
            <div
                class="Draggable DraggableRight"
                @mousedown="resizeRightMousedownHandler"
            ></div>
        </div>
        <div class="ResizeOptions">
            <span>Left:</span>
            <QSlider
                v-model="leftCrop"
                :min="0"
                :max="1024"
            />
            <span>Top:</span>
            <QSlider
                v-model="topCrop"
                :min="0"
                :max="576"
            />
            <span>Right:</span>
            <QSlider
                v-model="rightCrop"
                :min="0"
                :max="1024"
            />
            <span>Bottom:</span>
            <QSlider
                v-model="bottomCrop"
                :min="0"
                :max="576"
            />
            <QBtn @click="saveCropping">Save</QBtn>
            <QBtn @click="resetCropping">Use original cropping</QBtn>
        </div>
        <div>
            <QBtn @click="togglePlayerPause">{{ playerPaused ? 'Play' : 'Pause' }}</QBtn>
            <QBtn @click="togglePlayerMute">{{ playerMuted ? 'Unmute' : 'Mute' }}</QBtn>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useHead } from '@unhead/vue';
    import { computed, ref, useTemplateRef, watch, type Ref } from 'vue';
    import { oldBundle, streamsReplicant } from '../../browser_shared/replicants';

    useHead({ title: 'Crop Control', script: [{ src: 'https://player.twitch.tv/js/embed/v1.js' }] }); // set the title of this page

    const initWidth = 1024;
    const initHeight = 576;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    declare const Twitch: any;

    // new (in px)
    const leftCrop = ref(0);
    const topCrop = ref(0);
    const rightCrop = ref(0);
    const bottomCrop = ref(0);
    const playerMuted = ref(true);
    const playerPaused = ref(true);

    const containerWidth = computed(() => initWidth - leftCrop.value - rightCrop.value);
    const containerHeight = computed(() => initHeight - topCrop.value - bottomCrop.value);
    const twitchPlayerRef = useTemplateRef('twitchPlayer');

    const channelChoices = computed(
        () =>
            streamsReplicant?.data?.map((c, i) => ({ label: `${i}: ${c.channel}`, channel: c.channel, value: i })) ?? []
    );
    const currentChannel: Ref<{ label: string; channel: string; value: number } | null> = ref(null);

    watch(
        () => currentChannel.value,
        () => console.log(currentChannel.value)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let globalPlayer: any;

    watch(
        () => currentChannel.value,
        () => {
            const curChan = currentChannel.value;
            if (!curChan) return;
            destroyTwitchPlayer();
            createTwitchPlayer(curChan.channel, curChan.value);
        }
    );

    function createTwitchPlayer(channel: string, index: number) {
        const playerOptions = {
            autoplay: false,
            channel: channel,
            width: initWidth,
            height: initHeight
        };
        globalPlayer = new Twitch.Player(twitchPlayerRef.value!, playerOptions);
        globalPlayer.setMuted(true);
        playerMuted.value = true;
        playerPaused.value = true;
        const stream = streamsReplicant?.data?.[index];
        if (stream) {
            leftCrop.value = (-stream.leftPercent * initWidth) / 100;
            topCrop.value = (-stream.topPercent * initHeight) / 100;
            rightCrop.value = initWidth * (1 - 100 / stream.widthPercent) - leftCrop.value;
            bottomCrop.value = initHeight * (1 - 100 / stream.heightPercent) - topCrop.value;
        }
    }

    function destroyTwitchPlayer() {
        globalPlayer = null;
        // remove the iframe inside the twitchPlayer div
        twitchPlayerRef.value!.innerHTML = '';
    }

    // inspiration: https://codepen.io/jkasun/pen/QrLjXP

    function togglePlayerPause() {
        if (globalPlayer !== null) {
            if (playerPaused.value) {
                globalPlayer.play();
            } else {
                globalPlayer.pause();
            }
            playerPaused.value = !playerPaused.value;
        }
    }

    function togglePlayerMute() {
        if (globalPlayer !== null) {
            playerMuted.value = !playerMuted.value;
            globalPlayer.setMuted(playerMuted.value);
        }
    }

    interface OldBundleCropping {
        leftPercent: number;
        topPercent: number;
        widthPercent: number;
        heightPercent: number;
    }

    function resetCropping() {
        NodeCG.sendMessageToBundle('streams:getOriginalCropping', oldBundle, (cropping: OldBundleCropping) => {
            if (cropping) {
                leftCrop.value = (-cropping.leftPercent * initWidth) / 100;
                topCrop.value = (-cropping.topPercent * initHeight) / 100;
                rightCrop.value = initWidth * (1 - 100 / cropping.widthPercent) - leftCrop.value;
                bottomCrop.value = initHeight * (1 - 100 / cropping.heightPercent) - topCrop.value;
            }
        });
    }

    function saveCropping() {
        const newCropping: OldBundleCropping = {
            leftPercent: (-leftCrop.value * 100) / initWidth,
            topPercent: (-topCrop.value * 100) / initHeight,
            widthPercent: -100 / ((rightCrop.value + leftCrop.value) / initWidth - 1),
            heightPercent: -100 / ((topCrop.value + bottomCrop.value) / initHeight - 1)
        };
        const channelNum = currentChannel.value?.value;
        if (channelNum === undefined) return;
        if (!streamsReplicant?.data) return;
        console.log('saving cropping:', channelNum, newCropping);
        Object.assign(streamsReplicant.data[channelNum], newCropping);
        streamsReplicant.save();
        alert('cropping saved');
    }

    let dragBase = 0;
    function resizeTopMousedownHandler(e: MouseEvent) {
        dragBase = e.screenY - topCrop.value;
        document.onmousemove = function (e: MouseEvent) {
            const newCrop = Math.min(initHeight, Math.max(e.screenY - dragBase, 0));
            topCrop.value = newCrop;
        };
        document.onmouseup = function () {
            document.onmousemove = null;
        };
    }
    function resizeLeftMousedownHandler(e: MouseEvent) {
        dragBase = e.screenX - leftCrop.value;
        document.onmousemove = function (e: MouseEvent) {
            const newCrop = Math.min(initWidth, Math.max(e.screenX - dragBase, 0));
            leftCrop.value = newCrop;
        };
        document.onmouseup = function () {
            document.onmousemove = null;
        };
    }
    function resizeRightMousedownHandler(e: MouseEvent) {
        dragBase = e.screenX + rightCrop.value;
        document.onmousemove = function (e: MouseEvent) {
            const newCrop = Math.min(initWidth, Math.max(dragBase - e.screenX, 0));
            rightCrop.value = newCrop;
        };
        document.onmouseup = function () {
            document.onmousemove = null;
        };
    }
    function resizeBottomMousedownHandler(e: MouseEvent) {
        dragBase = e.screenY + bottomCrop.value;
        document.onmousemove = function (e: MouseEvent) {
            const newCrop = Math.min(initWidth, Math.max(dragBase - e.screenY, 0));
            bottomCrop.value = newCrop;
        };
        document.onmouseup = function () {
            document.onmousemove = null;
        };
    }
</script>

<style>
    .ResizeContainer {
        position: relative;
        height: 576px;
        width: 1024px;
    }

    .ResizeContainer > .TwitchPlayer {
        overflow: hidden;
        position: absolute;
        left: calc(1px * v-bind(leftCrop));
        top: calc(1px * v-bind(topCrop));
        width: calc(1px * v-bind(containerWidth));
        height: calc(1px * v-bind(containerHeight));
    }

    .ResizeContainer > .TwitchPlayer > iframe {
        position: relative;
        left: calc(-1px * v-bind(leftCrop));
        top: calc(-1px * v-bind(topCrop));
    }

    .Draggable {
        width: 10px;
        height: 10px;
        background: white;
        border: 2px solid black;
        position: absolute;
    }
    .DraggableTop {
        top: calc(-5px + 1px * v-bind(topCrop));
        left: calc(-5px + (1024px - 1px * v-bind(leftCrop) - 1px * v-bind(rightCrop)) / 2 + 1px * v-bind(leftCrop));
        cursor: n-resize;
    }
    .DraggableLeft {
        top: calc(-5px + (576px - 1px * v-bind(topCrop) - 1px * v-bind(bottomCrop)) / 2 + 1px * v-bind(topCrop));
        left: calc(-5px + 1px * v-bind(leftCrop));
        cursor: e-resize;
    }
    .DraggableBottom {
        top: calc(-5px + 576px - 1px * v-bind(bottomCrop));
        left: calc(-5px + (1024px - 1px * v-bind(leftCrop) - 1px * v-bind(rightCrop)) / 2 + 1px * v-bind(leftCrop));
        cursor: s-resize;
    }
    .DraggableRight {
        top: calc(-5px + (576px - 1px * v-bind(topCrop) - 1px * v-bind(bottomCrop)) / 2 + 1px * v-bind(topCrop));
        left: calc(-5px + 1024px - 1px * v-bind(rightCrop));
        cursor: w-resize;
    }
</style>
