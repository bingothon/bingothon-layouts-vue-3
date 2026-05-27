<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
    import { nextTick, onMounted, useTemplateRef } from 'vue';
    import { type RouteLocationNormalized, type RouterView, useRoute, useRouter } from 'vue-router';
    import { capturePositionsReplicant, waitForComposable } from '../../browser_shared/replicants.ts';

    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
        layoutChanged(route);
        router.afterEach(async (to) => {
            await nextTick();
            layoutChanged(to);
        });
    });

    function layoutChanged(route: RouteLocationNormalized): void {
        // Is the last replace needed?
        const layoutName = route.path.replace('/', '').replace('*', '');
        updateCapturePositionData(layoutName);
    }

    function updateCapturePositionData(layoutName: string): void {
        waitForComposable(capturePositionsReplicant).then(() => {
            if (!capturePositionsReplicant?.oldData || !capturePositionsReplicant.data) {
                return;
            }

            const gameLayoutRef = useTemplateRef<HTMLElement>('gameLayout');
            if (!gameLayoutRef.value) return;
            const numberOfStreams = gameLayoutRef.value.querySelectorAll('.PlayerContainer').length;
            const pos: { [k: string]: { x: number; y: number; width: number; height: number } } = {};

            for (let i = 0; i < numberOfStreams; i++) {
                const captureElem = useTemplateRef<HTMLElement>(`playerContainer-${i}`);
                const el = captureElem.value;
                if (!el) continue;

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
        });
    }
</script>
