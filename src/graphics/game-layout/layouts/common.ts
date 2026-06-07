import { computed } from 'vue';
import { bingoboardMeta, runDataActiveRunReplicant } from '../../../browser_shared/replicants.ts';

export const players = computed(() => runDataActiveRunReplicant?.data?.teams.flatMap((team) => team.players) ?? []);

export const isTeamRun = computed<boolean>(() => {
    if (!runDataActiveRunReplicant?.data) return false;
    return (
        (runDataActiveRunReplicant.data.teams.length > 1 &&
            runDataActiveRunReplicant.data.teams.length < 4 &&
            runDataActiveRunReplicant.data.teams[0].players.length > 1) ||
        false
    );
});

export const teamColor1 = computed<string>(() => {
    if (!bingoboardMeta?.data) return '';
    return bingoboardMeta.data.playerColors[0];
});

export const teamColor2 = computed<string>(() => {
    if (!bingoboardMeta?.data) return '';
    return bingoboardMeta.data.playerColors[2];
});
