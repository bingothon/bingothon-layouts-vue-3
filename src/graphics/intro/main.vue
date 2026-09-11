<template>
    <div id="Intro">
        <video
            id="bgvid"
            autoplay
            muted
            loop
        >
            <source
                src="../../../assets/Loop_v1_1.mp4"
                type="video/mp4"
            />
        </video>
        <div
            id="soom"
            class="FlexContainer"
        >
            Starting soon
        </div>
        <div id="matchupC">
            <div id="matchup">
                {{ gameAndCategory }}
                <br />
                -
                <br />
                {{ runnerString }}
            </div>
        </div>
        <div id="Countdown">
            <CountdownTimer />
        </div>
        <MusicDisplay id="Music" />
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { runDataActiveRunReplicant } from '../../browser_shared/replicants.ts';
    import CountdownTimer from '../components/countdownTimer.vue';
    import MusicDisplay from '../intermission/components/MusicDisplay.vue';

    const runnerString = computed(() =>
        runDataActiveRunReplicant?.data?.teams
            .map((t) => {
                const teamName = t.name ? `${t.name}: ` : '';
                const players = t.players.map((p) => p.name).join(', ');
                return `${teamName}${players}`;
            })
            .join(' vs. ')
    );
    const gameAndCategory = computed(() => {
        const run = runDataActiveRunReplicant?.data;
        if (!run) {
            return '';
        }
        return `${run.game} - ${run.category}`;
    });
</script>

<style>
    #Intro {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 1080px;
        width: 1920px;
    }
    #bgvid {
        object-fit: cover;
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
    }
    #soom {
        position: absolute;
        left: 0px;
        width: 1920px;
        align-content: center;
        top: 200px;
        font-size: 50px;
        color: white;
        text-shadow: 3px 3px 5px black;
    }
    #matchupC {
        position: absolute;
        left: 0px;
        width: 1920px;
        align-content: center;
        top: 300px;
        font-size: 50px;
        color: white;
        text-align: center;
        text-shadow: 3px 3px 5px black;
    }
    #Countdown {
        position: absolute;
        left: 0px;
        width: 1920px;
        align-content: center;
        top: 550px;
        font-size: 100px;
        color: white;
        text-align: center;
        text-shadow: 3px 3px 5px black;
    }
    #Music {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
        left: 1400px;
        top: 940px;
        width: 520px;
        height: 60px;
        font-size: 30px;
    }
</style>
