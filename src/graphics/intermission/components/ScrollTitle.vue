<template>
    <div
        ref="containerRef"
        class="scroll-container"
    >
        <div
            ref="contentRef"
            class="scroll-text"
            :class="{ 'is-scrolling': isOverflowing, 'is-centered': !isOverflowing }"
            :style="{ '--font-size': `${sizePx}px`, '--duration': `${animationDuration}s` }"
        >
            <!-- Duplicate the text block only if it overflows to create a seamless infinite loop -->
            <span class="text-content">{{ text }}</span>
            <span
                v-if="isOverflowing"
                class="text-content spacer"
                >{{ text }}</span
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';

    const props = withDefaults(defineProps<{ text: string; sizePx?: number }>(), {
        message: '',
        sizePx: 40
    });

    const containerRef = useTemplateRef<HTMLElement>('containerRef');
    const contentRef = useTemplateRef<HTMLElement>('contentRef');

    const isOverflowing = ref(false);
    const animationDuration = ref(10);

    const checkOverflow = async () => {
        await nextTick();
        if (!contentRef.value || !containerRef.value) return;

        // Temporarily remove class to get a pure width measurement
        isOverflowing.value = false;
        await nextTick();

        const textWidth = contentRef.value.scrollWidth;
        const containerWidth = containerRef.value.offsetWidth;

        if (textWidth > containerWidth) {
            isOverflowing.value = true;
            // Set speed dynamically based on length (e.g., 80 pixels per second)
            animationDuration.value = textWidth / 50;
        }
    };

    watch(() => props.text, checkOverflow);

    onMounted(() => {
        checkOverflow();
    });
</script>

<style scoped>
    .scroll-container {
        width: 100%;
        overflow: hidden; /* Hide the text when it leaves the box */
        display: flex;
        align-items: center;
    }

    .scroll-text {
        font-size: var(--font-size);
        white-space: nowrap;
        display: flex;
    }

    /* If it fits, center it nicely */
    .is-centered {
        width: 100%;
        justify-content: center;
    }

    /* If it overflows, run the CSS marquee animation */
    .is-scrolling {
        animation: marquee var(--duration) linear infinite;
    }

    .text-content {
        padding-right: 50px; /* The gap between the repeating text blocks */
    }

    @keyframes marquee {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-50%, 0, 0);
        } /* Moves exactly half way (one full text block width) */
    }
</style>
