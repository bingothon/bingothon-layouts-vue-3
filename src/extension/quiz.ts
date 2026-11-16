import { nodecg } from './util/nodecg.js';
import { bingoBoardMetaRep, quizBingoCellsRep, quizBingoRep } from './util/replicants.js';
import type { QuizBingo } from '../types/schemas/quizBingo.js';
import type { QuizBingoCells } from '../types/schemas/quizBingoCells.js';

const logger = new nodecg.Logger(`${nodecg.bundleName}:quiz`);

type Question = NonNullable<QuizBingo['questions']>[number][number];

nodecg.listenFor('quiz:reset', (data: { questions: Question[][]; categories: string[] }, cb) => {
    logger.debug('quiz reset quiz started');
    const { questions, categories } = data;
    if (!questions.length || questions.length !== 5 || !questions.every((questionsPerCat) => questionsPerCat.length === 5)) {
        if (cb && !cb.handled) {
            cb('Questions array is incorrectly formated');
        }
        return;
    }
    if (!categories.length && categories.length !== 5) {
        if (cb && !cb.handled) {
            cb('Categories array is incorrectly formated');
        }
        return;
    }

    quizBingoRep.value = {
        categories: quizBingoRep.value.categories,
        questions: quizBingoRep.value.questions,
        currentlySelected: null,
        stage: 'board'
    };

    logger.debug('Quiz replicant reset');
});

nodecg.listenFor('quiz:select', (data: { row: number; column: number }, cb) => {
    if (!data.row || !data.column) {
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

nodecg.listenFor('quiz:mark', (player: number | undefined, cb) => {
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

function quizToBingoboard(quiz: QuizBingo, colors: [string, string]): QuizBingoCells {
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
                    colors: color ? [{ color, style: '' }] : [],
                    rawColors: color ?? 'blank'
                };
            })
    );
    const colorCounts: Record<string, number> = {};
    /* cells.flat().forEach((cell) => {
        return cell.colors.forEach((col) => {
            return (colorCounts[col.color] = (colorCounts[col.color] ?? 0) + 1);
        });
    });*/
    return { cells, colorCounts, colors, scores: computeQuizScore(quiz) };
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
    const colors: [string, string] = bingoBoardMetaRep.value
        ? [bingoBoardMetaRep.value?.playerColors[0], bingoBoardMetaRep.value?.playerColors[1]]
        : ['blank', 'blank'];
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
