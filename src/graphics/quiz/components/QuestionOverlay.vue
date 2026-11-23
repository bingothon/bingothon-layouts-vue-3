<template>
    <div class="QuestionOverlay">
        <!-- 1. Dim + blur everything behind -->
        <Transition name="backdrop">
            <div
                v-if="showQuestionModal"
                class="Backdrop"
            ></div>
        </Transition>

        <!-- 2. Question card -->
        <Transition name="card">
            <div
                v-if="showQuestionModal && selectedQuestionMarker"
                class="Card"
            >
                <div class="CardHeader">
                    <span class="Category">{{ quiz?.categories?.[selectedQuestionMarker.column] }}</span>
                    <span class="Difficulty">Difficulty {{ selectedQuestionMarker.row + 1 }}</span>
                </div>

                <div class="QuestionText">
                    {{ questionText }}
                </div>

                <!-- 3. Answer slides up when stage === 'answer' -->
                <Transition name="answer">
                    <div
                        v-if="showAnswer"
                        class="Answer"
                        :style="{ '--answer-color': answerColor }"
                    >
                        <span class="AnswerLabel">{{ lang === 'fr' ? 'Réponse' : 'Answer' }}</span>
                        <span class="AnswerText">{{ answerText }}</span>
                    </div>
                </Transition>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { quizBingoCellsReplicant, quizBingoReplicant } from '../../../browser_shared/replicants.ts';

    const lang = new URLSearchParams(window.location.search).get('lang') === 'fr' ? 'fr' : 'en';

    const quiz = computed(() => quizBingoReplicant?.data);

    const cells = computed(() => quizBingoCellsReplicant?.data);

    const selectedQuestionMarker = computed<{ column: number; row: number } | null>(
        () => quiz.value?.currentlySelected ?? null
    );

    const selectedQuestion = computed(() =>
        !selectedQuestionMarker.value
            ? null
            : quiz.value?.questions?.[selectedQuestionMarker.value?.column][selectedQuestionMarker.value?.row]
    );

    const showQuestionModal = computed<boolean>(
        () => (quizBingoReplicant?.data?.currentlySelected && quiz.value?.stage !== 'board') ?? false
    );

    const showAnswer = computed(() => showQuestionModal.value && quiz.value?.stage === 'answer');

    const questionText = computed<string | undefined>(() => {
        if (!selectedQuestion.value) return;
        return lang === 'fr' ? selectedQuestion.value.questionFr : selectedQuestion.value.question;
    });

    const answerText = computed<string | undefined>(() => {
        if (!selectedQuestion.value) return;
        return lang === 'fr' ? selectedQuestion.value.answerFr : selectedQuestion.value.answer;
    });

    const answeredBy = computed(() => selectedQuestion.value?.markedPlayer ?? undefined);

    const answerColor = computed(() => {
        const p = answeredBy.value;
        return p === undefined ? '' : (cells.value?.colors?.[p] ?? '');
    });
</script>

<style scoped>
    /* ---------- Layout ---------- */
    .QuestionOverlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .Backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(6px);
    }

    .Card {
        position: absolute;
        left: 460px;
        top: 170px;
        width: 1000px;
        height: 540px;
        box-sizing: border-box;
        padding: 40px 56px;
        display: flex;
        flex-direction: column;
        gap: 28px;
        border-radius: 16px;
        border: 2px solid rgba(255, 255, 255, 0.15);
        background: linear-gradient(-128deg, var(--gradient-light) 0, var(--gradient-dark) 100%);
        color: var(--font-color);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .CardHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.85;
    }

    .QuestionText {
        flex: 1;
        font-size: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 1.25;
        overflow: hidden;
    }

    .Answer {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 18px 24px;
        border-radius: 10px;
        border-left: 10px solid var(--answer-color);
        background: rgba(0, 0, 0, 0.25);
    }
    .AnswerLabel {
        font-size: 20px;
        text-transform: uppercase;
        opacity: 0.7;
    }
    .AnswerText {
        font-size: 40px;
        font-weight: bold;
    }

    .QuestionText,
    .AnswerText {
        white-space: pre-line;
    }

    /* ---------- Animations ---------- */

    /* Backdrop: plain fade */
    .backdrop-enter-active,
    .backdrop-leave-active {
        transition: opacity 0.4s ease;
    }
    .backdrop-enter-from,
    .backdrop-leave-to {
        opacity: 0;
    }

    /* Card: pops in with a slight overshoot after the backdrop starts, leaves quickly */
    .card-enter-active {
        transition:
            opacity 0.45s ease 0.1s,
            transform 0.45s cubic-bezier(0.2, 1.4, 0.4, 1) 0.1s;
    }
    .card-leave-active {
        transition:
            opacity 0.25s ease-in,
            transform 0.25s ease-in;
    }
    .card-enter-from {
        opacity: 0;
        transform: translateY(30px) scale(0.85);
    }
    .card-leave-to {
        opacity: 0;
        transform: scale(0.95);
    }

    /* Answer: slides up out of the card bottom */
    .answer-enter-active {
        transition:
            opacity 0.4s ease,
            transform 0.5s cubic-bezier(0.2, 1.3, 0.4, 1);
    }
    .answer-leave-active {
        transition: opacity 0.2s ease;
    }
    .answer-enter-from {
        opacity: 0;
        transform: translateY(24px) scale(0.97);
    }
    .answer-leave-to {
        opacity: 0;
    }
</style>
