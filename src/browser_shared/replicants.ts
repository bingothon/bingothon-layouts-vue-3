import { useReplicant } from 'nodecg-vue-composable';
import type { RunDataActiveRun, Timer, TwitchCommercialTimer } from 'speedcontrol-util/types/speedcontrol/schemas';
import type * as oldSchemas from '../../../bingothon-layouts/schemas';
import type { Schemas } from '../types';
import type { RunDataArray } from 'speedcontrol-util/types/speedcontrol';

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
export const voiceActivityReplicant = useReplicant<oldSchemas.VoiceActivity>('voiceActivity', oldBundle);
export const currentMainBingoboard = useReplicant<oldSchemas.CurrentMainBingoboard>('currentMainBingoboard', oldBundle);
export const bingoboardMeta = useReplicant<oldSchemas.BingoboardMeta>('bingoboardMeta', oldBundle);
export const hostsSpeakingDuringIntermissionReplicant = useReplicant<oldSchemas.HostsSpeakingDuringIntermission>('hostsSpeakingDuringIntermission', oldBundle);
export const showThingsDuringIntermissionReplicant = useReplicant<oldSchemas.ShowThingsDuringIntermission>('showThingsDuringIntermission', oldBundle);
export const donationTotalReplicant = useReplicant<oldSchemas.DonationTotal>('donationTotal', oldBundle);
export const trackerOpenBidsReplicant = useReplicant<oldSchemas.TrackerOpenBids>('trackerOpenBids', oldBundle);
export const trackerPrizesReplicant = useReplicant<oldSchemas.TrackerPrizes>('trackerPrizes', oldBundle);

// SpeedControl Replicants
export const runDataActiveRunReplicant = useReplicant<RunDataActiveRun>('runDataActiveRun', scBundle);
export const runDataArrayReplicant = useReplicant<RunDataArray>('runDataArray', scBundle);
export const timerReplicant = useReplicant<Timer>('timer', scBundle);
export const twitchCommercialTimerReplicant = useReplicant<TwitchCommercialTimer>('twitchCommercialTimer', scBundle);
