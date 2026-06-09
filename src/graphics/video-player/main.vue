<template>
    <div id="PlayerContainer">
        <div
            v-if="nextRun"
            id="upcoming"
        >
            <div id="next">Coming Up Next:</div>
            <div id="run">
                <div id="fit">
                    <TextFit
                        font-size="30"
                        :text="`${nextRun.game} - ${nextRun.category}`"
                    ></TextFit>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { runDataActiveRunReplicant } from '../../browser_shared/replicants.ts';
    import TextFit from '../components/helpers/textFits/textFit.vue';

    const nextRun = computed(() => runDataActiveRunReplicant?.data);
</script>

<style>
    #PlayerContainer {
        height: 900px;
        overflow: hidden;
    }

    body {
        background: linear-gradient(-128deg, var(--gradient-light) 0, var(--gradient-dark) 100%) 100% no-repeat fixed;
    }

    #player {
        position: absolute;
        top: 30px;
        left: 124px; /* (1920 - width) / 2 */
        width: 1671px; /* height / 1080 * 1920 */
        height: 940px; /* 1080 - (80 + 2*top) */
    }

    #upcoming {
        position: absolute;
        top: 1000px;
        left: 124px;
        width: 1000px;
        height: 100px;
        font-weight: 500;
        line-height: 60px;
        color: #fff;
        font-size: 41px;
        text-transform: uppercase;
    }

    #next {
        padding-left: 10px;
        background-image: linear-gradient(
            var(--darker-main-color) 0%,
            var(--darker-main-color) 50%,
            rgba(0, 0, 0, 0.5) 100%
        );
        width: 400px;
    }

    #run {
        position: absolute;
        padding-left: 10px;
        padding-right: 10px;
        top: 0px;
        left: 410px;
        background-image: linear-gradient(
            var(--darker-main-color) 0%,
            var(--darker-main-color) 50%,
            rgba(0, 0, 0, 0.5) 100%
        );
        width: 1240px;
        /* Don't ask why, text fit does weird things*/
        height: 60px;
    }

    #fit {
        top: 50%;
        position: relative;
    }
</style>
