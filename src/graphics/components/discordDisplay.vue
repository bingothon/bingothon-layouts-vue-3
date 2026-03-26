<script setup lang="ts">
    import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { computed } from 'vue';
    import { voiceActivityReplicant } from '../../browser_shared/replicants';
    import TextFit from './textFit.vue';

    const props = withDefaults(
        defineProps<{
            iconHeightPx: number;
            nameWidthPx: number;
            voiceHighlightColor: string;
            maxUserCount?: number;
        }>(),
        {
            maxUserCount: 20
        }
    );

    const members = computed(() => {
        const all = voiceActivityReplicant?.data?.members ?? [];
        return all.slice(0, props.maxUserCount);
    });
</script>

<template>
    <div
        class="DiscordVoiceDisplay FlexContainer"
        :style="{
            '--icon-height': iconHeightPx + 'px',
            '--name-width': nameWidthPx + 'px',
            '--voice-highlight-color': voiceHighlightColor
        }"
    >
        <div
            v-for="member in members"
            :key="member.id"
            class="Member FlexContainer"
            :class="{ Active: member.isSpeaking }"
        >
            <div class="AvatarContainer">
                <img :src="member.avatar" />
                <div class="MicIcon FlexContainer">
                    <font-awesome-icon
                        :icon="faMicrophone"
                        :style="{ color: 'white' }"
                    />
                </div>
            </div>
            <div class="Name">
                <TextFit :text="member.name" />
            </div>
        </div>
    </div>
</template>

<style scoped>
    .DiscordVoiceDisplay {
        justify-content: center;
        align-content: center;
        text-align: center;
        flex-wrap: wrap;
    }

    .DiscordVoiceDisplay > .Member {
        margin: 5px 0 0 5px;
    }

    .DiscordVoiceDisplay > .Member > .AvatarContainer {
        position: relative;
    }

    .DiscordVoiceDisplay > .Member > .AvatarContainer > img {
        width: var(--icon-height);
        height: var(--icon-height);
        border-radius: 100%;
    }

    .DiscordVoiceDisplay > .Member > .AvatarContainer > .MicIcon {
        position: absolute;
        width: 25px;
        height: 25px;
        top: -4px;
        right: -4px;
        background-color: var(--voice-highlight-color);
        border-radius: 100%;

        opacity: 0;
    }

    .DiscordVoiceDisplay > .Member.Active > .AvatarContainer > .MicIcon {
        opacity: 1;
    }

    .DiscordVoiceDisplay > .Member > div.Name {
        font-size: 22px;
        margin-left: 8px;
        margin-right: 8px;
        color: white;
        width: var(--name-width);
        position: relative;
    }

    .DiscordVoiceDisplay > .Member.Active > div.Name {
        text-shadow: 0px 0px 15px var(--voice-highlight-color);
    }
</style>
