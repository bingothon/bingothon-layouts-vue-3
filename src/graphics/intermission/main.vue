<template>
    <div id="Intermission">
        <div class="ImageOverlay"></div>
        <img
            id="logoSummer"
            src="../../../assets/logo-summer-wide.png"
        />
        <div id="host-bingo-text">Host Bingo</div>
        <run-upcoming
            v-if="nextRun"
            id="ComingUpNext"
            :data="nextRun"
        ></run-upcoming>
        <!--        <rotation></rotation>-->
        <div id="ReaderAndMusic">
            <div
                v-if="hostsSpeakingDuringIntermission"
                class="Mic"
            >
                <img src="../../../assets/mic.png" />
            </div>
            <DiscordDisplay
                v-if="hostsSpeakingDuringIntermission"
                voice-highlight-color="var(--darker-main-color)"
                :icon-height-px="40"
                :name-width-px="100"
            ></DiscordDisplay>
            <MusicDisplay :use-small-variant="hostsSpeakingDuringIntermission"></MusicDisplay>
        </div>

        <div class="HostingBingo">
            <!--            <HostBingo
                id="Bingo-board"
                class="BingoBoard"
                font-size="20px"
            ></HostBingo>-->
        </div>
        <div :class="'ImageView ' + (showIntermissionImage ? 'PictureShown' : '')">
            <img
                v-if="showIntermissionImage"
                :src="intermissionImageUrl"
            />
        </div>
        <TwitchClipPlayer />
        <iframe
            v-if="!!intermissionVdoUrl"
            id="vdoPlayer"
            :src="intermissionVdoUrl"
        ></iframe>
    </div>
</template>

<script setup lang="ts">
    // import Rotation from './components/Rotation.vue';
    import RunUpcoming from './components/RunUpcoming.vue';
    import type { RunData } from 'speedcontrol-util/types/speedcontrol/RunData';
    import DiscordDisplay from '../components/discordDisplay.vue';
    // import HostBingo from '../components/hostBingo.vue';
    import MusicDisplay from './components/MusicDisplay.vue';
    import TwitchClipPlayer from './components/TwitchClipPlayer.vue';
    import { computed, onMounted, ref, watch } from 'vue';
    import {
        hostsSpeakingDuringIntermissionReplicant,
        runDataActiveRunReplicant,
        runDataArrayReplicant,
        showThingsDuringIntermissionReplicant
    } from '../../browser_shared/replicants.ts';

    const nextRun = ref<RunData | null>(null);

    const hostsSpeakingDuringIntermission = computed(
        () => hostsSpeakingDuringIntermissionReplicant?.data?.speaking ?? false
    );
    // The host dashboard is actively "polluting" data for showThingsDuringIntermissionReplicant, oldData holds the actual replicant value
    const showIntermissionImage = computed(() => !!showThingsDuringIntermissionReplicant?.oldData?.imageUrl);
    const intermissionImageUrl = computed(() => showThingsDuringIntermissionReplicant?.oldData?.imageUrl ?? '');
    const intermissionVdoUrl = computed(() => showThingsDuringIntermissionReplicant?.oldData?.vdoUrl);

    onMounted(() => {
        nodecg.listenFor('forceRefreshIntermission', refreshUpcomingRun);
        if (runDataActiveRunReplicant?.data && runDataArrayReplicant?.data) {
            refreshUpcomingRun();
            return;
        }

        // 3. One-time watcher: Wait for data to arrive, process it, then immediately self-destruct
        const unwatch = watch(
            () => [runDataActiveRunReplicant?.data, runDataArrayReplicant?.data],
            ([activeRun, runArray]) => {
                // Once both values exist in the composable state
                if (activeRun && runArray) {
                    refreshUpcomingRun();

                    // Boom. The watcher tears itself down and never fires again.
                    unwatch();
                }
            }
        );
    });

    function refreshUpcomingRun() {
        const curRun = runDataActiveRunReplicant?.data;
        if (!curRun) return;
        const runArray = runDataArrayReplicant?.data;
        if (!runArray) return;
        const upcoming = runArray[findRunIndex(curRun) + 1];
        if (upcoming) {
            nextRun.value = upcoming;
        }
    }

    function findRunIndex(run: RunData): number {
        const curRunID = run.id;
        if (!curRunID) {
            return -1;
        }
        const runArray = runDataArrayReplicant?.data;
        if (!runArray) return -1;
        return runArray.findIndex((run) => run.id === curRunID);
    }
</script>

<style scoped>
    #Intermission {
        height: 1080px;
        overflow: hidden;
    }

    #logoWinter {
        position: absolute;
        left: 48px;
        top: 50px;
        width: 631px;
    }

    #logoSummer {
        position: absolute;
        left: 48px;
        top: 20px;
        width: 631px;
    }

    #ComingUpNext {
        position: absolute;
        left: 718px;
        top: 31px;
        width: 1172px;
        height: 199px;
        color: white;
    }

    #host-bingo-text {
        width: 100%;
        font-weight: 500;
        height: 60px;
        line-height: 60px;
        color: #fff;
        font-size: 41px;
        text-transform: uppercase;
        position: absolute;
        left: 105px;
        top: 237px;
    }

    #Rotation {
        left: 718px;
        top: 240px;
        width: 1172px;
        height: 660px;
        color: white;
    }

    #ReaderAndMusic {
        justify-content: flex-start;
        flex-direction: row;
        background-color: rgba(0, 0, 0, 0.3);
        left: 718px;
        top: 910px;
        width: 1172px;
        height: 60px;
        font-size: 30px;
        box-sizing: border-box;
        position: absolute;
    }

    .DiscordVoiceDisplay {
        left: 750px;
        top: 920px;
    }

    .Mic {
        top: 910px;
        height: 60px;
        padding: 5px;
    }

    .Mic > img {
        top: 910px;
        height: 60px;
        object-fit: contain;
    }

    .Music {
        position: absolute;
    }

    body {
        background: linear-gradient(-128deg, var(--gradient-light) 0, var(--gradient-dark) 100%) 100% no-repeat fixed;
        /* background-image: url("../../../static/bg-new.jpg"); */
    }

    .CardPlaceholder {
        position: absolute;
        top: 350px;
        left: 0px;
        height: 650px;
        width: 650px;
        background-color: var(--container-background-color);
    }

    .HostingBingo {
        position: absolute;
        color: #fff;
        top: 315px;
        height: 670px;
        width: 670px;
        font-size: 50px;
        left: 20px;
    }

    .ImageOverlay {
        position: absolute;
        top: 255px;
        left: 1px;
        width: 712px;
        height: 135px;
        background-image: url(http://localhost:9090/bundles/bingothon-layouts/graphics/js/../img/snowbanner-5127a2773ddbe60639022ef42942cc78.png);
        background-size: cover;
        background-repeat: no-repeat;
        z-index: 1;
    }

    .HostingBingo > .BingoBoard {
        height: 670px;
        width: 670px;
        position: relative;
    }

    .ImageView {
        position: absolute;
        top: 300px;
        height: 670px;
        width: 670px;
        left: 33px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ImageView.PictureShown {
        background: rgba(0, 0, 0, 0.7);
    }

    .ImageView > img {
        max-width: 100%;
        max-height: 100%;
    }

    #twitchClipEmbed {
        position: absolute;
        left: 718px;
        top: 240px;
        width: 1172px;
        height: 660px;
    }

    #vdoPlayer {
        position: absolute;
        left: 718px;
        top: 240px;
        width: 1172px;
        height: 660px;
        z-index: 100;
    }
</style>
