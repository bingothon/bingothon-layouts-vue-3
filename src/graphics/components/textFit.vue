<template>
    <div
        ref="containerRef"
        class="TextContainer"
    >
        <div
            ref="contentRef"
            class="FittedTextContent"
            :style="{ transform, top }"
        >
            {{ text }}
        </div>
    </div>
</template>

<script setup lang="ts">
    import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';

    const props = withDefaults(
        defineProps<{
            text: string;
            align?: 'left' | 'center' | 'right';
        }>(),
        {
            align: 'left'
        }
    );

    const containerRef = useTemplateRef<HTMLElement>('containerRef');
    const contentRef = useTemplateRef<HTMLElement>('contentRef');

    const transform = ref('scaleX(1)');
    const top = ref('0');

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
            }
        }
    });

    async function fit() {
        // reset to natural size so we can measure the real content width
        transform.value = 'scaleX(1)';
        top.value = '0';

        await nextTick();

        const container = containerRef.value;
        const fittedContent = contentRef.value;
        if (!container || !fittedContent) return;

        let scaleX = container.clientWidth / fittedContent.clientWidth;
        // limit scaleX to 1 (don't stretch text, only shrink)
        scaleX = Math.min(scaleX, 1);

        let toLeft = (container.clientWidth - fittedContent.clientWidth) / 2;
        if (scaleX === 1) {
            if (props.align === 'left') {
                toLeft = 0;
            } else if (props.align === 'right') {
                toLeft *= 2;
            }
        }

        transform.value = `translateY(-50%) translateX(${toLeft}px) scaleX(${scaleX})`;
        top.value = '50%';
    }
</script>

<style scoped>
    .TextContainer {
        width: 100%;
        height: 100%;
        white-space: nowrap;
        position: relative;
    }

    .FittedTextContent {
        position: absolute;
    }
</style>
