import type NodeCG from 'nodecg/types';
import type { Schemas } from '../../types/index.js';
import type { BingoboardMeta } from '../../../../bingothon-layouts/schemas/bingoboardMeta.js';
import { nodecg } from './nodecg.js';

// Wrapper for replicants that have a default (based on schema).
function hasDefault<T>(name: string) {
    return nodecg.Replicant<T>(name) as unknown as NodeCG.default.ServerReplicantWithSchemaDefault<T>;
}
// Wrapper for replicants that don't have a default (based on schema).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasNoDefault<T>(name: string) {
    return nodecg.Replicant<T>(name) as NodeCG.default.ServerReplicant<T>;
}

function oldDefault<T>(name: string) {
    return nodecg.Replicant<T>(name, 'bingothon-layouts');
}

/**
 * This is where you can declare all of your replicants to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const exampleReplicant = hasDefault<Schemas.ExampleReplicant>('exampleReplicant');
export const blurbsReplicant = hasDefault<Schemas.Blurbs>('blurbs');
export const themeReplicant = hasDefault<Schemas.Theme>('theme');
export const countdownTimerRep = hasDefault<Schemas.CountdownTimer>('countdownTimer');
export const quizBingoRep = hasDefault<Schemas.QuizBingo>('quizBingo');
export const quizBingoCellsRep = hasDefault<Schemas.QuizBingoCells>('quizBingoCells');

export const bingoBoardMetaRep = oldDefault<BingoboardMeta>('bingoboardMeta');
