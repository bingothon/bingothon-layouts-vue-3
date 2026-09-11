<template>
    <div
        class="Omnibar"
        :class="themeClass"
    >
        <img
            class="WideLogo"
            :src="`../../assets/logo-${themeClass}-wide.png`"
        />
        <div class="Divider"></div>
        <transition
            name="fade"
            mode="out-in"
        >
            <div
                :key="currentMessage"
                class="DynamicMessage"
            >
                {{ currentMessage }}
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import { omnibarMessagesReplicant } from '../../browser_shared/replicants.ts';
    import { themeClass } from '../theme.ts';

    const CYCLE_TIMER = 30_000;
    const currentMessage = computed(() => dynamicMessages.value[latestDynamicMessage.value].message);
    const latestDynamicMessage = ref(0);
    const dynamicMessages = computed(() => omnibarMessagesReplicant?.data ?? []);

    function updateMessage() {
        if (dynamicMessages.value.length) {
            latestDynamicMessage.value = (latestDynamicMessage.value + 1) % dynamicMessages.value.length;
        }
    }
    let timer: number | null = null;

    onMounted(() => {
        timer = window.setInterval(updateMessage, CYCLE_TIMER);
    });

    onUnmounted(() => {
        if (timer) clearInterval(timer);
    });
</script>

<style>
    .Omnibar {
        display: flex;
        left: 0px;
        top: 0px;
        width: 1920px;
        height: 80px;
        &:not(.neutral) {
            background: linear-gradient(-128deg, var(--gradient-light) 0, var(--gradient-dark) 100%) 100% no-repeat
                fixed;
        }
        &.neutral {
            background: url(../../../assets/middle-info-background.png);
        }
    }
    .WideLogo {
        padding: 5px;
    }
    .Divider {
        height: 100%;
        width: 3px;
        min-width: 3px;
        background-color: white;
    }
    .DynamicMessage {
        width: 100%;
        font-weight: 500;
        font-size: 33px;
        color: white;
        text-align: center;
        align-self: center;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
