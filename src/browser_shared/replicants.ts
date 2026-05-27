import { useReplicant } from 'nodecg-vue-composable';
import type { RunDataActiveRun, Timer } from 'speedcontrol-util/types/speedcontrol';
import type * as oldSchemas from '../../../bingothon-layouts/schemas';
import type { Schemas } from '../types';
import { nextTick, watch } from 'vue';

// YOU MUST CHANGE THIS TO YOUR BUNDLE'S NAME!
export const thisBundle = 'bingothon-layouts-vue-3';
export const oldBundle = 'bingothon-layouts';
export const scBundle = 'nodecg-speedcontrol';

/**
 * This is where you can declare all of your replicants to import easily into other (browser based) files.
 * "useReplicant" is a helper composable to make accessing/modifying replicants easier.
 * For more information see https://github.com/Dan-Shields/nodecg-vue-composable
 */
export const exampleReplicant = useReplicant<Schemas.ExampleReplicant>('exampleReplicant', thisBundle);

export const capturePositionsReplicant = useReplicant<oldSchemas.CapturePositions>('capturePositions', oldBundle);
export const voiceActivityReplicant = useReplicant<oldSchemas.VoiceActivity>('voiceActivity', oldBundle);
export const currentMainBingoboard = useReplicant<oldSchemas.CurrentMainBingoboard>('currentMainBingoboard', oldBundle);
export const bingoboardMeta = useReplicant<oldSchemas.BingoboardMeta>('bingoboardMeta', oldBundle);
export const soundOnTwitchStream = useReplicant<number>('soundOnTwitchStream', oldBundle);
export const bestOfX = useReplicant<oldSchemas.BestOfX>('bestOfX', oldBundle);
export const streamsReplicant = useReplicant<oldSchemas.TwitchStream[]>('twitchStreams', oldBundle);
export const discordDelayInfo = useReplicant<oldSchemas.DiscordDelayInfo>('discordDelayInfo', oldBundle);

// SpeedControl Replicants
export const runDataActiveRunReplicant = useReplicant<RunDataActiveRun>('runDataActiveRun', scBundle);
export const timerReplicant = useReplicant<Timer>('timer', scBundle);

export async function waitForComposable(replicant: ReturnType<typeof useReplicant>) {
    return new Promise<void>((resolve, reject) => {
        if (!replicant) return reject(new Error('Replicant not found'));
        if (replicant.data) return resolve();
        const stop = watch(
            () => replicant.data,
            () => {
                if (replicant.data) {
                    nextTick(() => stop());
                    resolve();
                }
            },
            { immediate: true, deep: true }
        );
    });
}
