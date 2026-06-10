<template>
    <div
        class="Interview"
        :class="themeClass"
    >
        <img
            id="logo"
            :src="`../../../assets/logo-${themeClass}-wide.png`"
        />
        <div
            id="fillvoice"
            class="flexContainer"
        ></div>
        <div
            v-if="isTeamRun"
            id="team-container"
        >
            <div
                class="team"
                :style="{ border: `5px ${teamColor1} solid` }"
            >
                <PlayerInfo
                    class="player"
                    :player-index="0"
                    :show-color="false"
                    :hide-sound-icon="true"
                    height="45px"
                ></PlayerInfo>
                <TeamInfo
                    :team-index="0"
                    :show-color="false"
                ></TeamInfo>
                <PlayerInfo
                    class="player"
                    :player-index="1"
                    :show-color="false"
                    :hide-sound-icon="true"
                    height="45px"
                ></PlayerInfo>
            </div>
            <div
                class="team"
                :style="{ border: `5px ${teamColor2} solid` }"
            >
                <PlayerInfo
                    class="player"
                    :player-index="2"
                    :show-color="false"
                    :hide-sound-icon="true"
                    height="45px"
                ></PlayerInfo>
                <TeamInfo
                    :team-index="1"
                    :show-color="false"
                ></TeamInfo>
                <PlayerInfo
                    class="player"
                    :player-index="3"
                    :show-color="false"
                    :hide-sound-icon="true"
                    height="45px"
                ></PlayerInfo>
            </div>
        </div>
        <div
            v-else
            id="player-container"
        >
            <PlayerInfo
                v-for="(_player, playerIndex) in players"
                :key="playerIndex"
                class="player"
                :player-index="playerIndex"
                :show-color="true"
                :hide-sound-icon="true"
                height="45px"
            ></PlayerInfo>
        </div>
        <GameInfoContainer id="game"></GameInfoContainer>
        <TimerContainer id="timer"></TimerContainer>
        <BingoBoard
            id="Bingo-board"
            font-size="20px"
        ></BingoBoard>
        <DiscordDisplay
            id="discord-voice"
            :mic-height-px="40"
            :icon-height-px="100"
            :max-user-count="16"
            :name-width-px="220"
            voice-highlight-color="var(--discord-voice-highlight-color)"
        ></DiscordDisplay>
    </div>
</template>

<script setup lang="ts">
    import BingoBoard from '../components/bingoboard/bingoBoard.vue';
    import DiscordDisplay from '../components/discordDisplay.vue';
    import GameInfoContainer from '../components/gameInfo/gameInfoContainer.vue';
    import PlayerInfo from '../components/runnerInfo/playerInfo.vue';
    import TeamInfo from '../components/runnerInfo/teamInfo.vue';
    import TimerContainer from '../components/timerContainer.vue';
    import { isTeamRun, players, teamColor1, teamColor2 } from '../game-layout/layouts/common.ts';
    import { themeClass } from '../theme.ts';
</script>

<style>
    #player-container {
        position: absolute;
        top: 500px;
        left: 90px;
    }
    #team-container {
        position: absolute;
        top: 500px;
        left: 90px;
    }
    .player {
        width: 500px;
    }
    #player-container .player {
        margin-bottom: 30px;
    }
    .team {
        width: 500px;
        margin-bottom: 30px;
    }
    .Interview {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 1920px;
        height: 1080px;
        background: linear-gradient(-128deg, var(--gradient-light) 0, var(--gradient-dark) 100%) 100% no-repeat fixed;
    }

    #discord-voice {
        position: absolute;
        top: -90px;
        left: 1220px;
        width: 700px;
        height: 1080px;
    }
    #logo {
        position: absolute;
        left: 60px;
        top: 150px;
        width: 568px;
    }
    #Bingo-board {
        position: absolute;
        top: 500px;
        left: 710px;
        width: 500px;
        height: 500px;
    }

    #game {
        position: absolute;
        top: 150px;
        left: 700px;
        width: 520px;
        height: 100px;
    }

    #timer {
        position: absolute;
        top: 325px;
        left: 710px;
        width: 500px;
        height: 150px;
    }
</style>
