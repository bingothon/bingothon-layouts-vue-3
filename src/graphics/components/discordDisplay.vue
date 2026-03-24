<script setup lang="ts">
    import { voiceActivityReplicant } from '../../browser_shared/replicants';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

    const { iconHeightPx, nameWidthPx, voiceHighlightColor, maxUserCount } = defineProps({
        iconHeightPx: { type: Number, required: true },
        nameWidthPx: { type: Number, required: true },
        voiceHighlightColor: { type: String, required: true },
        maxUserCount: { type: Number, required: false, default: 20 }
    });

    let members = voiceActivityReplicant?.data?.members || [];
    if (members.length > maxUserCount) {
        members = members.slice(0, maxUserCount);
    }
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
                <img :src="member.avatar">
                <div class="MicIcon FlexContainer">
                    <font-awesome-icon
                        :icon="faMicrophone"
                        :style="{ color: 'white' }"
                    />
                </div>
            </div>
            <div class="Name">
                <text-fit :text="member.name" />
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
