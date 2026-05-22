<template>
    <transition name="fade">
        <div
            v-if="show"
            class="Music FlexContainer"
            :style="{
                width: `${useSmallVariant ? '450' : '1172'}px`,
                left: `${useSmallVariant ? '730' : '0'}px`
            }"
        >
            <div class="MCat">
                <img src="../../../../assets/music.png" />
            </div>
            <div
                ref="nameContainer"
                class="NameContainer"
            >
                <div
                    ref="songNameContainer"
                    class="Name"
                    :class="{ Animation1: scrollingEffect }"
                >
                    {{ name }}
                </div>
                <div
                    v-if="scrollingEffect"
                    class="Name Animation2"
                >
                    {{ name }}
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
    import type { SongData } from '../../../../../bingothon-layouts/schemas';
    import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
    import { songDataReplicant } from '../../../browser_shared/replicants.ts';

    const props = defineProps({ useSmallVariant: Boolean });

    const show = ref<boolean>(false);
    const name = ref<string>('');
    const scrollingEffect = ref<boolean>(false);

    const nameContainerRef = useTemplateRef<HTMLElement>('nameContainer');
    const songNameContainerRef = useTemplateRef<HTMLElement>('songNameContainer');

    onMounted(() => {
        watch(() => songDataReplicant?.data, onSongDataUpdate, { immediate: true });
    });

    function onSongDataUpdate(newSong: SongData | undefined) {
        if (newSong && newSong.playing) {
            name.value = newSong.title;
            show.value = true;
            initScroll();
        } else {
            show.value = false;
        }
    }

    function initScroll() {
        // disable scrolling effect until we know if it's needed
        scrollingEffect.value = false;
        nextTick(() => {
            // wait for transition
            if (!nameContainerRef.value || !songNameContainerRef.value) return;
            const songNameContainer = songNameContainerRef.value;
            const nameContainer = nameContainerRef.value;
            // if the name is bigger than the container we need to scroll
            scrollingEffect.value = songNameContainer.clientWidth > nameContainer.clientWidth;
        });
    }

    watch(
        () => props.useSmallVariant,
        () => {
            if (show.value) {
                initScroll();
            }
        }
    );
</script>

<style scoped>
    .Music {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .MCat {
        box-sizing: border-box;
        height: 100%;
        padding: 5px;
    }

    .MCat > img {
        height: 100%;
        object-fit: contain;
    }

    .NameContainer {
        position: relative;
        flex: 1;
        margin: 0 15px;
        overflow: hidden;
        height: 100%;
        vertical-align: super;
        align-items: center;
        display: flex;
    }

    .NameContainer > .Name {
        position: absolute;
        overflow: hidden;
        white-space: nowrap;
    }

    .NameContainer > .Name.Animation1 {
        /* Make sure that this one reaches default position before the other one goes away to avoid flickering*/
        animation: music-marquee1 15s 200ms linear infinite;
    }

    .NameContainer > .Name.Animation2 {
        animation: music-marquee2 15s linear infinite;
    }

    @keyframes music-marquee1 {
        0% {
            transform: translateX(110%);
        }
        20% {
            transform: translateX(110%);
        }
        90% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(0);
        }
    }

    @keyframes music-marquee2 {
        0% {
            transform: translateX(0%);
        }
        20% {
            transform: translateX(0%);
        }
        90% {
            transform: translateX(-110%);
        }
        100% {
            transform: translateX(-110%);
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 1s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
