import type { QuizBingo } from '../types/schemas/quizBingo';
import { type BingoCell, getStyle } from '../graphics/components/bingoboard/util.ts';

interface ScoreObject {
    goals: number;
    lineScore: number;
    totalScore: number;
}

export function computeQuizScore(quiz: QuizBingo): [ScoreObject, ScoreObject] {
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

    // total goals
    quiz.questions?.forEach((catQuestions, r) => {
        let player0CatBingo: boolean = true;
        let player1CatBingo: boolean = true;
        catQuestions.forEach((question, c) => {
            if (question.markedPlayer === 0) {
                player0Goals++;
                player1CatBingo = false;
                player1Cols[c] = false;
            }
            if (question.markedPlayer === 1) {
                player1Goals++;
                player0CatBingo = false;
                player0Cols[c] = false;
            }
            if (!question.markedPlayer) {
                player0CatBingo = false;
                player1CatBingo = false;
                player0Cols[c] = false;
                player1Cols[c] = false;
            }

            // Main Diag
            if (r === c) {
                if (question.markedPlayer !== 0) player0MainDiag = false;
                if (question.markedPlayer !== 1) player1MainDiag = false;
            }

            // Anti Diag
            if (r + c === 4) {
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

    return [
        { goals: player0Goals, lineScore: player0LineScore, totalScore: player0TotalScore },
        { goals: player1Goals, lineScore: player1LineScore, totalScore: player1TotalScore }
    ];
}

export function quizToBingoCells(quiz: QuizBingo, colors: [string, string]): BingoCell[][] {
    return quiz.questions![0].map((_, colIndex) => {
        return quiz.questions!.map((row, rowIndex) => {
            const question = row[colIndex];
            return questionToBingoCell(question, `${quiz.categories![rowIndex]} ${colIndex}`, colors);
        });
    });
}

function questionToBingoCell(question: NonNullable<QuizBingo['questions']>[number][number], name: string, colors: [string, string]): BingoCell {
    return {
        name,
        rawColors: question.markedPlayer ? colors[question.markedPlayer] : 'blank',
        markers: new Array(4).fill(null),
        colors: question.markedPlayer ? [{ color: colors[question.markedPlayer], style: getStyle(1, '') }] : []
    };
}
