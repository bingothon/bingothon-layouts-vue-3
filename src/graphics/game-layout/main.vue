<template>
    <router-view :class="themeClass"></router-view>
</template>

<script setup lang="ts">
    import { nextTick, onMounted } from 'vue';
    import { type RouteLocationNormalizedLoadedGeneric, useRoute, useRouter } from 'vue-router';
    import type { CapturePositions } from '../../../../bingothon-layouts/schemas/capturePositions';
    import { capturePositionsReplicant, waitForComposable } from '../../browser_shared/replicants.ts';
    import { themeClass } from '../theme.ts';

    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
        layoutChanged(route);
        router.afterEach(async (to) => {
            await nextTick();
            layoutChanged(to);
        });
    });

    function layoutChanged(route: RouteLocationNormalizedLoadedGeneric): void {
        const layoutName = route.name as string;
        updateCapturePositionData(layoutName);
    }

    function updateCapturePositionData(layoutName: string): void {
        waitForComposable(capturePositionsReplicant).then(() => {
            if (!capturePositionsReplicant?.oldData || !capturePositionsReplicant.data) {
                return;
            }
            // only update capture positions if we're in obs
            if (!('obsstudio' in window)) return;

            const numberOfStreams = document.querySelectorAll('.TwitchPlayerContainer').length;
            const pos: CapturePositions[string] = {};

            for (let i = 0; i < numberOfStreams; i++) {
                const el = document.querySelector(`.TwitchPlayerContainer[data-index="${i}"]`);
                if (!el) {
                    console.error(`Could not find TwitchPlayerContainer with data-index=${i}`);
                    continue;
                }

                const sizes = el.getBoundingClientRect();

                // Get the widths of all the borders to figure out the position/size without them.
                const topBorder = getComputedStyle(el).getPropertyValue('border-top-width');
                const rightBorder = getComputedStyle(el).getPropertyValue('border-right-width');
                const bottomBorder = getComputedStyle(el).getPropertyValue('border-bottom-width');
                const leftBorder = getComputedStyle(el).getPropertyValue('border-left-width');
                pos[el.id] = {
                    x: sizes.x + parseInt(leftBorder, 10),
                    y: sizes.y + parseInt(topBorder, 10),
                    width: sizes.width - parseInt(rightBorder, 10) - parseInt(leftBorder, 10),
                    height: sizes.height - parseInt(bottomBorder, 10) - parseInt(topBorder, 10)
                };
            }

            capturePositionsReplicant.data[layoutName] = pos;
            capturePositionsReplicant.save();
        });
    }
</script>
