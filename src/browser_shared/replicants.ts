import { useReplicant } from 'nodecg-vue-composable';
import type * as oldSchemas from '../../../bingothon-layouts/schemas';
import type { Schemas } from '../types';

// YOU MUST CHANGE THIS TO YOUR BUNDLE'S NAME!
const thisBundle = 'bingothon-layouts-vue-3';
const oldBundle = 'bingothon-layouts';

/**
 * This is where you can declare all of your replicants to import easily into other (browser based) files.
 * "useReplicant" is a helper composable to make accessing/modifying replicants easier.
 * For more information see https://github.com/Dan-Shields/nodecg-vue-composable
 */
export const exampleReplicant = useReplicant<Schemas.ExampleReplicant>('exampleReplicant', thisBundle);
export const voiceActivityReplicant = useReplicant<oldSchemas.VoiceActivity>('voiceActivity', oldBundle);
