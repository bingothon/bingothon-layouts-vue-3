import { computed, ref, watch } from 'vue';
import { quizBuzzersReplicant } from './replicants.ts';

export const timeToAnswerMs = computed(() => quizBuzzersReplicant?.data?.timeToAnswerMs || 10_000);
export const buzzerOpen = computed(() => quizBuzzersReplicant?.data?.open ?? false);
export const buzzedPlayer = computed(() => quizBuzzersReplicant?.data?.player?.number);

export function useBuzzerCountdown(player?: number) {
    const timerLeftMs = ref(0);
    let interval: NodeJS.Timeout | undefined;

    const buzzerActive = computed(() => {
        const buzzerActive = buzzedPlayer.value !== undefined && !buzzerOpen.value;
        let playerBuzzed = true;
        if (player !== undefined) {
            playerBuzzed = buzzedPlayer.value === player;
        }
        return buzzerActive && playerBuzzed;
    });

    function stopCountdown() {
        clearInterval(interval);
        interval = undefined;
        timerLeftMs.value = 0;
    }

    function startCountdown() {
        stopCountdown();
        const timerEnd = Date.now() + timeToAnswerMs.value;
        const countdown = () => {
            timerLeftMs.value = Math.max(0, timerEnd - Date.now());
            if (timerLeftMs.value === 0) stopCountdown();
        };
        countdown();
        interval = setInterval(countdown, 100);
    }

    watch([buzzerActive, () => quizBuzzersReplicant?.data?.player?.at], () => (buzzerActive.value ? startCountdown() : stopCountdown()));

    return {
        timerLeftMs: timerLeftMs,
        progressPercent: computed(() => (timerLeftMs.value / timeToAnswerMs.value) * 100)
    };
}
