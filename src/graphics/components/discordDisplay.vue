<template>
    <div
        class="DiscordVoiceDisplay FlexContainer"
        :style="{
            '--icon-height': iconHeightString,
            '--name-width': nameWidthString,
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

<script setup lang="ts">
    import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { computed } from 'vue';
    import { voiceActivityReplicant } from '../../browser_shared/replicants';
    import TextFit from './helpers/textFits/textFit.vue';

    const props = withDefaults(
        defineProps<{
            iconHeightPx: number;
            nameWidthPx: number;
            micHeightPx?: number;
            voiceHighlightColor: string;
            maxUserCount?: number;
        }>(),
        {
            maxUserCount: 20,
            micHeightPx: 25
        }
    );

    const iconHeightString = computed(() => `${props.iconHeightPx}px`);
    const nameWidthString = computed(() => `${props.nameWidthPx}px`);
    const micHeightString = computed(() => `${props.micHeightPx}px`);

    const members = computed(() => {
        const all = voiceActivityReplicant?.data?.members ?? [];
        return all.slice(0, props.maxUserCount);
    });
</script>

<style scoped>
    .DiscordVoiceDisplay {
        justify-content: center;
        align-content: center;
        text-align: center;
        flex-wrap: wrap;
        box-sizing: border-box;
    }

    .DiscordVoiceDisplay .Member {
        margin: 5px 0 0 5px;
    }

    .DiscordVoiceDisplay .Member .AvatarContainer {
        position: relative;
    }

    .DiscordVoiceDisplay .Member .AvatarContainer img {
        width: v-bind(iconHeightString);
        height: v-bind(iconHeightString);
        border-radius: 100%;
    }

    .DiscordVoiceDisplay .Member .AvatarContainer .MicIcon {
        position: absolute;
        width: v-bind(micHeightString);
        height: v-bind(micHeightString);
        top: -4px;
        right: -4px;
        background-color: v-bind(voiceHighlightColor);
        border-radius: 100%;

        opacity: 0;
    }

    .MicIcon > svg {
        width: calc(v-bind(micHeightString));
        height: calc(v-bind(micHeightString) / 1.5);
    }

    .DiscordVoiceDisplay .Member.Active .AvatarContainer .MicIcon {
        opacity: 1;
    }

    .DiscordVoiceDisplay .Member div.Name {
        font-size: 22px;
        margin-left: 8px;
        margin-right: 8px;
        color: white;
        width: v-bind(nameWidthString);
        position: relative;
    }

    .Member.Active .Name {
        text-shadow: 0 0 15px v-bind(voiceHighlightColor);
    }
</style>
