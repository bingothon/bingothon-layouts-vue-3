<template>
    <div
        ref="containerRef"
        class="TextContainer"
    >
        <div
            ref="contentRef"
            class="FittedTextContent"
            :style="{ transform, top, position }"
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
            position?: 'absolute' | 'relative';
            fontSize?: string;
            relativeMargin?: number;
        }>(),
        {
            align: 'left',
            position: 'absolute',
            fontSize: '22px',
            relativeMargin: 10
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
        requestAnimationFrame(async () => {
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
    });

    async function fit() {
        // reset to natural size so we can measure the real content width
        transform.value = props.position === 'relative' ? 'none' : 'scaleX(1)';
        top.value = '0';

        await nextTick();

        const container = containerRef.value;
        const fittedContent = contentRef.value;
        if (!container || !fittedContent) return;

        let targetWidth = container.clientWidth;
        let toLeft: number;
        let scaleX: number;

        if (props.position === 'relative') {
            const contentWidth = fittedContent.getBoundingClientRect().width;
            const trueParentBox = container.closest('.PlayerChipCommon, .PlayerChip, .TeamChip');

            if (trueParentBox) {
                targetWidth = trueParentBox.getBoundingClientRect().width;
            } else if (container.parentElement?.parentElement) {
                // Fallback to legacy behavior if class isn't found
                targetWidth = container.parentElement.parentElement.getBoundingClientRect().width;
            } else {
                targetWidth = container.getBoundingClientRect().width;
            }

            targetWidth -= props.relativeMargin;

            if (props.text === 'atomical_sloths') {
                console.log('TEXT:', props.text);
                console.log('TARGET WIDTH (Parent Container):', targetWidth);
                console.log('CONTENT WIDTH (The Text Itself):', contentWidth);
            }

            scaleX = targetWidth / contentWidth;
            scaleX = Math.min(scaleX, 1);

            toLeft = 0;
            if (scaleX < 1) {
                switch (props.align) {
                    case 'center':
                        toLeft = (targetWidth - contentWidth * scaleX) / 2;
                        if (props.text === 'atomical_sloths') {
                            console.log('SCALING: scaleX ', scaleX);
                            console.log('SCALING: toLeft ', toLeft);
                        }
                        break;
                    case 'right':
                        toLeft = targetWidth - contentWidth * scaleX;
                        break;
                    case 'left':
                    default:
                        toLeft = 0;
                        break;
                }
            }
        } else {
            const contentWidth = fittedContent.clientWidth;
            scaleX = targetWidth / contentWidth;
            // limit scaleX to 1 (don't stretch text, only shrink)
            scaleX = Math.min(1, scaleX);

            toLeft = (targetWidth - contentWidth) / 2;

            if (scaleX === 1) {
                if (props.align === 'left') {
                    toLeft = 0;
                } else if (props.align === 'right') {
                    toLeft *= 2;
                }
            }
        }
        transform.value = `translateY(-50%) translateX(${toLeft}px) scaleX(${scaleX})`;
        top.value = '50%';
    }
</script>

<style scoped>
    .TextContainer {
        /* If this fixes your relative layout text scale, the width constraint is the culprit */
        width: v-bind("props.position === 'relative' ? 'auto' : '100%'") !important;
        height: 100%;
        white-space: nowrap;
        position: relative;
        font-size: v-bind('props.fontSize');
    }

    .FittedTextContent {
        font-size: inherit;
    }
</style>
