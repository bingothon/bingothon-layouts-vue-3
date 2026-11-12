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

    const showInput = ref<boolean>(false);
    const textInput = ref<string>('');

    function changeInputActive() {
        showInput.value = !showInput.value;
    }

    async function resetQuiz() {
        const input = JSON.parse(textInput.value);
        if (!input.questions || !input.categories) {
            throw new Error('Input has no questions and/or categories');
        }
        console.log('sending message');
        nodecg.sendMessageToBundle('resetQuiz', thisBundle, input).catch((e: Error) => {
            throw e;
        });
    }
</script>

<style scoped></style>
