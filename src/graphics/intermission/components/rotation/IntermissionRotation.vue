<template>
    <div id="Rotation">
        <transition name="fade">
            <component
                :is="currentComponent"
                :next-runs="nextRuns"
                @end="showNextMsg"
            >
            </component>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { type Component, onMounted, ref, shallowRef, watch } from 'vue';
    import UpcomingRuns from './UpcomingRuns.vue';
    import OpenBid from './OpenBid.vue';
    import TrackerPrize from './TrackerPrize.vue';
    import BingothonSocials from './BingothonSocials.vue';
    import type { RunData } from 'speedcontrol-util/types';
    import { runDataActiveRunReplicant, runDataArrayReplicant } from '../../../../browser_shared/replicants.ts';

    const currentComponent = shallowRef<Component | null>(null);
    const componentArray: Array<Component> = [UpcomingRuns, OpenBid, TrackerPrize, BingothonSocials];
    const nextRuns = ref<RunData[]>([]);
    let index: number = 0;

    onMounted(() => {
        nodecg.listenFor('forceRefreshIntermission', () => updateNextRuns());
        if (runDataArrayReplicant?.data) {
            updateNextRuns();
        } else {
            const unwatch = watch(
                () => runDataArrayReplicant?.data,
                () => {
                    if (runDataArrayReplicant?.data) {
                        updateNextRuns();
                        unwatch();
                    }
                }
            );
        }
        showNextMsg();
    });

    function showNextMsg() {
        if (index >= componentArray.length) {
            index = 0;
        }
        currentComponent.value = componentArray[index];
        index += 1;
    }

    function updateNextRuns() {
        if (!runDataArrayReplicant?.data) return;
        nextRuns.value = runDataArrayReplicant.data.slice(findRunIndex() + 1).slice(0, 4);
    }

    function findRunIndex(): number {
        const curRunID = runDataActiveRunReplicant?.data?.id;
        if (!curRunID || !runDataArrayReplicant?.data) {
            return -1;
        }
        return runDataArrayReplicant?.data?.findIndex((run) => run.id === curRunID);
    }
</script>

<style>
    #Rotation {
        position: absolute;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
