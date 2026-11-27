import { nodecg } from './util/nodecg.js';
import { bingoBoardMetaRep, quizBingoCellsRep, quizBingoRep, quizBuzzersRep } from './util/replicants.js';
import type { QuizBingo } from '../types/schemas/quizBingo.js';
import type { QuizBingoCells } from '../types/schemas/quizBingoCells.js';

const logger = new nodecg.Logger(`${nodecg.bundleName}:quiz`);

type Question = NonNullable<QuizBingo['questions']>[number][number];
type Categories = NonNullable<QuizBingo['categories']>;

nodecg.listenFor('quiz:reset', (data: { questions: Question[][]; categories: Categories }, cb) => {
    try {
        logger.debug('quiz reset quiz started');
        const { questions, categories } = data;
        if (questions.length !== 5 || !questions.every((questionsPerCat) => questionsPerCat.length === 5)) {
            if (cb && !cb.handled) {
                cb('Questions array is incorrectly formated');
            }
            return;
        }
        if (categories?.length !== 5) {
            if (cb && !cb.handled) {
                cb('Categories array is incorrectly formated');
            }
            return;
        }

        quizBingoRep.value = {
            categories: categories,
            questions: questions,
            currentlySelected: null,
            stage: 'board'
        };

        logger.debug('Quiz replicant reset');

        if (cb && !cb.handled) {
            cb();
        }
    } catch (e) {
        if (cb && !cb.handled) {
            if ((e as unknown as Error).message) {
                cb((e as unknown as Error).message);
                return;
            }
            cb('Failed to reset quiz');
            return;
        }
    }
});

nodecg.listenFor('quiz:select', (data: { row: number; column: number }, cb) => {
    const row = data.row ?? undefined;
    const column = data.column ?? undefined;
    if (row === undefined || column === undefined) {
        if (cb && !cb.handled) {
            cb('No coordinates specified');
        }
        return;
    }

    quizBingoRep.value.currentlySelected = { row: data.row, column: data.column };
    quizBingoRep.value.stage = 'question';
});

nodecg.listenFor('quiz:deselect', () => {
    quizBingoRep.value.currentlySelected = null;
    quizBingoRep.value.stage = 'board';
});

nodecg.listenFor('quiz:setStage', (stage: 'board' | 'question' | 'answer') => {
    quizBingoRep.value.stage = stage;
});

nodecg.listenFor('quiz:mark', (player: number | null, cb) => {
    if (!quizBingoRep.value.currentlySelected) {
        if (cb && !cb.handled) {
            cb('No coordinates specified');
        }
        return;
    }
    if (!quizBingoRep.value.questions) {
        if (cb && !cb.handled) {
            cb('Questions array is incorrectly formated');
        }
        return;
    }
    quizBingoRep.value.questions[quizBingoRep.value.currentlySelected.column][quizBingoRep.value.currentlySelected.row].markedPlayer = player ?? undefined;
});

nodecg.listenFor('quiz:buzzer', (data: { player: number }, cb) => {
    // lock buzzer precautionary, so no race condition can happen
    quizBuzzersRep.value.open = false;
    const now = Date.now();
    if (quizBuzzersRep.value.player && quizBuzzersRep.value.player.at < now) {
        if (cb && !cb.handled) {
            cb('Buzzer is currently locked');
            return;
        }
    }
    quizBuzzersRep.value.player = { number: data.player, at: now };
    setTimeout(resetBuzzer, quizBuzzersRep.value.timeToAnswerMs);
});

nodecg.listenFor('quiz:buzzerReset', resetBuzzer);

function resetBuzzer() {
    quizBuzzersRep.value.player = null;
    quizBuzzersRep.value.open = true;
}

function quizToBingoboard(quiz: QuizBingo, colors: [string, string, string]): QuizBingoCells {
    const cells = Array.from(
        { length: 5 },
        (
            _,
            qIdx // board row = difficulty
        ) =>
            Array.from({ length: 5 }, (_, catIdx): QuizBingoCells['cells'][number][number] => {
                // board col = category
                const question = quiz.questions?.[catIdx]?.[qIdx];
                const color = question?.markedPlayer === null || question?.markedPlayer === undefined ? undefined : colors[question.markedPlayer];
                return {
                    name: `${quiz.categories?.[catIdx] ?? ''} ${qIdx + 1}`,
                    colors: color ? [color] : [],
                    rawColors: color ?? 'blank'
                };
            })
    );
    return { cells, colors, scores: computeQuizScore(quiz) };
}

function computeQuizScore(quiz: QuizBingo): QuizBingoCells['scores'] {
    let player0Goals: number = 0;
    let player1Goals: number = 0;
    let player0LineScore: number = 0;
    let player1LineScore: number = 0;

    // Diag. completion
    let player0MainDiag: boolean = true;
    let player1MainDiag: boolean = true;
    let player0AntiDiag: boolean = true;
    let player1AntiDiag: boolean = true;

    // track col completion
    const player0Cols = new Array<boolean>(5).fill(true);
    const player1Cols = new Array<boolean>(5).fill(true);

    if (!quiz.questions) {
        return [
            { goals: 0, lineScore: 0, totalScore: 0 },
            { goals: 0, lineScore: 0, totalScore: 0 }
        ];
    }

    // total goals
    quiz.questions.forEach((catQuestions, catIdx) => {
        let player0CatBingo: boolean = true;
        let player1CatBingo: boolean = true;
        catQuestions.forEach((question, qIdx) => {
            if (question.markedPlayer === 0) {
                player0Goals++;
                player1CatBingo = false;
                player1Cols[qIdx] = false;
            }
            if (question.markedPlayer === 1) {
                player1Goals++;
                player0CatBingo = false;
                player0Cols[qIdx] = false;
            }
            if (question.markedPlayer === null || question.markedPlayer === undefined) {
                player0CatBingo = false;
                player1CatBingo = false;
                player0Cols[qIdx] = false;
                player1Cols[qIdx] = false;
            }

            // Main Diag
            if (catIdx === qIdx) {
                if (question.markedPlayer !== 0) player0MainDiag = false;
                if (question.markedPlayer !== 1) player1MainDiag = false;
            }

            // Anti Diag
            if (catIdx + qIdx === 4) {
                if (question.markedPlayer !== 0) player0AntiDiag = false;
                if (question.markedPlayer !== 1) player1AntiDiag = false;
            }
        });

        if (player0CatBingo) player0LineScore += 3;
        if (player1CatBingo) player1LineScore += 3;
    });

    for (let c = 0; c < 5; c++) {
        if (player0Cols[c]) player0LineScore += c + 1;
        if (player1Cols[c]) player1LineScore += c + 1;
    }

    if (player0MainDiag) player0LineScore += 3;
    if (player1MainDiag) player1LineScore += 3;
    if (player0AntiDiag) player0LineScore += 3;
    if (player1AntiDiag) player1LineScore += 3;

    const player0TotalScore = player0Goals + player0LineScore;
    const player1TotalScore = player1Goals + player1LineScore;

    // wait for replicant to have loaded
    if (bingoBoardMetaRep.value) {
        bingoBoardMetaRep.value.manualScores[0] = player0TotalScore;
        bingoBoardMetaRep.value.manualScores[1] = player1TotalScore;
    }

    return [
        { goals: player0Goals, lineScore: player0LineScore, totalScore: player0TotalScore },
        { goals: player1Goals, lineScore: player1LineScore, totalScore: player1TotalScore }
    ];
}

function updateQuizCells() {
    const colors: [string, string, string] = [
        bingoBoardMetaRep.value?.playerColors[0] ?? 'pink',
        bingoBoardMetaRep.value?.playerColors[1] ?? 'red',
        bingoBoardMetaRep.value?.playerColors[2] ?? 'orange'
    ];
    quizBingoCellsRep.value = quizToBingoboard(quizBingoRep.value, colors);
}

quizBingoRep.on('change', updateQuizCells);
// if color changes update the quizBoard to represent the new colors
bingoBoardMetaRep.on('change', (newVal, oldVal) => {
    // only update when colors changed, in particular do not update when scores change cause that will trigger an infinite update loop
    if (!newVal) {
        return;
    }
    const newColors = newVal.playerColors;
    const oldColors = oldVal?.playerColors;
    let colorChange = false;
    if (newColors.length != oldColors?.length) colorChange = true;
    newColors.forEach((_, i) => {
        if (oldColors?.[i] != newColors[i]) {
            colorChange = true;
        }
    });
    if (colorChange) {
        updateQuizCells();
    }
});
