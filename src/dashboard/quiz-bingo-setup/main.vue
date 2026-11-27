<template>
    <div>
        <div>
            <QInput
                v-if="showInput"
                v-model="textInput"
                :disable="!showInput"
                dark
                filled
                type="textarea"
            >
            </QInput>
            <QBtn
                dark
                color="black"
                small
                @click="resetQuiz"
                >Save Input</QBtn
            >
        </div>
        <QBtn
            dark
            color="black"
            small
            @click="changeInputActive"
            >{{ showInput ? 'Deactivate Edit' : 'Activate Edit' }}</QBtn
        >
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { thisBundle } from '../../browser_shared/replicants.ts';
    import { useQuasar } from 'quasar';

    const showInput = ref<boolean>(false);
    const textInput = ref<string>('');

    const $q = useQuasar();
    function changeInputActive() {
        showInput.value = !showInput.value;
    }

    async function resetQuiz() {
        // Too lazy to properly type this, check extension or replicant for proper typing
        let input: { questions?: unknown; categories?: unknown };
        try {
            input = JSON.parse(textInput.value);
        } catch (e) {
            $q.notify((e as unknown as Error).message);
            return;
        }
        if (!input.questions || !input.categories) {
            $q.notify('Input has no questions and/or categories');
            return;
        }
        try {
            await nodecg.sendMessageToBundle('quiz:reset', thisBundle, {
                questions: input.questions,
                categories: input.categories
            });
        } catch (e) {
            $q.notify(e as unknown as Error);
            return;
        }
    }
</script>

<style scoped></style>
