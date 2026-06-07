<template>
    <div id="UpcomingRuns">
        <run-upcoming
            v-for="run in runs"
            :key="run[0].id"
            :data="run[0]"
            :when="run[1]"
        ></run-upcoming>
    </div>
</template>

<script setup lang="ts">
    import clone from 'clone';
    import RunUpcoming from '../RunUpcoming.vue';
    import type { RunData } from 'speedcontrol-util/types/speedcontrol/schemas';
    import { nextTick, onMounted, ref } from 'vue';

    const props = defineProps<{ nextRuns: RunData[] }>();

    const emit = defineEmits(['end']);

    // runData, when
    const runs = ref<[RunData, number | undefined][]>([]);
    let whenTotal: number = 0;

    onMounted(() => {
        if (!props.nextRuns.length) {
            nextTick(() => emit('end'));
            return;
        }
        for (let i = 0; i < props.nextRuns.length; i += 1) {
            const cloned = clone(props.nextRuns[i]);
            const when = whenTotal;
            whenTotal += props.nextRuns[i].estimateS || 0;
            whenTotal += props.nextRuns[i].setupTimeS || 0;
            if (i !== 0) {
                runs.value.push([cloned, when]);
            }
        }
        setTimeout(() => emit('end'), 20 * 1000);
    });
</script>

<style>
    #UpcomingRuns {
        position: absolute;
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        justify-content: space-around;
    }
</style>
