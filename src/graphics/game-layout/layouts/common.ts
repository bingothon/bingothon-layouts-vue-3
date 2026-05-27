import { computed } from 'vue';
import { runDataActiveRunReplicant } from '../../../browser_shared/replicants.ts';

export const players = computed(() => runDataActiveRunReplicant?.data?.teams.flatMap((team) => team.players) ?? []);
