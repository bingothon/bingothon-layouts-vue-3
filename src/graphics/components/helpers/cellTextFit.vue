<template>
    <div ref="containerRef" class="cellTextFixContainer">
        <div
            ref="contentRef"
            class="fittedContent"
            :style="{
                transform,
                top: '50%',
                '--font-size-multiplier': fontSizeMultiplier,
                'font-size': `calc(${fontSize} * var(--font-size-multiplier))`
            }"
            v-html="text"
        />
    </div>
</template>

<script setup lang="ts">
    import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';

    const props = defineProps<{
        text: string;
        fontSize: string;
    }>();

    const containerRef = useTemplateRef<HTMLElement>('containerRef');
    const contentRef = useTemplateRef<HTMLElement>('contentRef');

    const transform = ref('scaleX(1) scaleY(1)');
    const top = ref('0');
    const fontSizeMultiplier = ref(1);

    watch(
        () => props.text,
        () => fit(),
        { immediate: true }
    );

    onMounted(async () => {
        if (contentRef.value) {
            const font = window.getComputedStyle(contentRef.value).font;
            if (font) {
                await document.fonts.load(font);
                await fit();
                // fonts can report ready before painting, re-fit after a delay as a safety net
                setTimeout(() => void fit(), 1000);
            } else {
                await fit();
            }
        }
    });

    async function fit() {
        let depth = 0;
        fontSizeMultiplier.value = 1;

        const container = containerRef.value;
        const fittedContent = contentRef.value;
        if (!container || !fittedContent) return;
        for (;;) {
            await nextTick();

            // get width height of parent and text container to calc scaling
            // limit max scale to 1
            const scaleX = Math.min(1, container.clientWidth / fittedContent.clientWidth);
            const scaleY = Math.min(1, container.clientHeight / fittedContent.clientHeight);
            if (depth < 10 && (scaleY < 0.8 || scaleX < 0.7)) {
                const minScale = Math.min(scaleY, scaleX);
                let multiplier = 0.9;
                if (minScale < 0.4) {
                    multiplier = 0.6;
                } else if (minScale < 0.5) {
                    multiplier = 0.7;
                } else if (minScale < 0.6) {
                    multiplier = 0.8;
                }
                fontSizeMultiplier.value *= multiplier;
                depth += 1;
                continue;
            }
            // center
            const toLeft = (container.clientWidth - fittedContent.clientWidth) / 2;
            transform.value = `translateY(-50%) translateX(${toLeft}px) scaleX(${scaleX}) scaleY(${scaleY})`;
            top.value = '50%';
            break;
        }
    }
</script>

<style scoped>
    .cellTextFixContainer {
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .cellTextFixContainer > .fittedContent {
        position: absolute;
        left: 0;
    }
    span.underline {
        text-decoration: underline;
    }
</style>
