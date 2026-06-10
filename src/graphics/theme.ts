import { computed } from 'vue';
import { themeReplicant } from '../browser_shared/replicants';

export const themeClass = computed(() => themeReplicant?.data?.theme);
