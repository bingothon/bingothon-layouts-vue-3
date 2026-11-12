import { nodecg } from './util/nodecg.js';
import { quizBingoRep } from './util/replicants.js';

const logger = new nodecg.Logger(`${nodecg.bundleName}:quiz`);

nodecg.listenFor('resetQuiz', (data: { questions: { question: string; answer: string }[][]; categories: string[] }, cb) => {
    logger.debug('quiz reset quiz started');
    const { questions, categories } = data;
    if (!questions.length && questions.length !== 25 && !questions.every((questionsPerCat) => questionsPerCat.length !== 5)) {
        if (cb && !cb.handled) {
            cb('Questions array is incorrectly formated');
        }
    }
    if (!categories.length && categories.length !== 5) {
        if (cb && !cb.handled) {
            cb('Categories array is incorrectly formated');
        }
        return;
    }

    logger.debug('Quiz replicant reset');
    quizBingoRep.value.categories = categories as [string, string, string, string, string];
    quizBingoRep.value.questions = questions;
    quizBingoRep.value.currentlySelected = undefined;
});
