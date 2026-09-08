import { useReplicant } from 'nodecg-vue-composable';
import type { RunDataArray } from 'speedcontrol-util/types/speedcontrol';
import type { RunDataActiveRun, Timer, TwitchCommercialTimer } from 'speedcontrol-util/types/speedcontrol/schemas';
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
export const blurbsReplicant = useReplicant<Schemas.Blurbs>('blurbs', thisBundle);

export const capturePositionsReplicant = useReplicant<oldSchemas.CapturePositions>('capturePositions', oldBundle);
export const allGameLayoutsReplicant = useReplicant<oldSchemas.AllGameLayouts>('allGameLayouts', oldBundle);
export const currentGameLayoutReplicant = useReplicant<oldSchemas.CurrentGameLayout>('currentGameLayout', oldBundle);
export const voiceActivityReplicant = useReplicant<oldSchemas.VoiceActivity>('voiceActivity', oldBundle);
export const currentMainBingoboard = useReplicant<oldSchemas.CurrentMainBingoboard>('currentMainBingoboard', oldBundle);
export const bingoboardMeta = useReplicant<oldSchemas.BingoboardMeta>('bingoboardMeta', oldBundle);
export const soundOnTwitchStream = useReplicant<number>('soundOnTwitchStream', oldBundle);
export const bestOfX = useReplicant<oldSchemas.BestOfX>('bestOfX', oldBundle);
export const hostsSpeakingDuringIntermissionReplicant = useReplicant<oldSchemas.HostsSpeakingDuringIntermission>('hostsSpeakingDuringIntermission', oldBundle);
export const showThingsDuringIntermissionReplicant = useReplicant<oldSchemas.ShowThingsDuringIntermission>('showThingsDuringIntermission', oldBundle);
export const donationTotalReplicant = useReplicant<oldSchemas.DonationTotal>('donationTotal', oldBundle);
export const trackerOpenBidsReplicant = useReplicant<oldSchemas.TrackerOpenBids>('trackerOpenBids', oldBundle);
export const trackerPrizesReplicant = useReplicant<oldSchemas.TrackerPrizes>('trackerPrizes', oldBundle);
export const obsCurrentSceneReplicant = useReplicant<null | string>('obsCurrentScene', oldBundle);
export const streamsReplicant = useReplicant<oldSchemas.TwitchStream[]>('twitchStreams', oldBundle);
export const discordDelayInfo = useReplicant<oldSchemas.DiscordDelayInfo>('discordDelayInfo', oldBundle);
export const hostingBingoboard = useReplicant<oldSchemas.HostingBingoboard>('hostingBingoboard', oldBundle);
export const songDataReplicant = useReplicant<oldSchemas.SongData>('songData', oldBundle);
export const obsConnectionReplicant = useReplicant<oldSchemas.ObsConnection>('obsConnection', oldBundle);
export const obsConnectionPresetsReplicant = useReplicant<oldSchemas.ObsConnectionPresets>('obsConnectionPresets', oldBundle);
export const obsStreamSourceTypeReplicant = useReplicant<oldSchemas.ObsStreamSourceType>('obsStreamSourceType', oldBundle);
export const obsAudioLevels = useReplicant<oldSchemas.ObsAudioLevels>('obsAudioLevels', oldBundle);
export const playerSlotsReplicant = useReplicant<oldSchemas.PlayerSlots>('playerSlots', oldBundle);

// SpeedControl Replicants
export const runDataActiveRunReplicant = useReplicant<RunDataActiveRun>('runDataActiveRun', scBundle);
export const runDataArrayReplicant = useReplicant<RunDataArray>('runDataArray', scBundle);
export const timerReplicant = useReplicant<Timer>('timer', scBundle);
export const twitchCommercialTimerReplicant = useReplicant<TwitchCommercialTimer>('twitchCommercialTimer', scBundle);

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
