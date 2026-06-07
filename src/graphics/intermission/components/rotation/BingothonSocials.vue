<template>
    <div id="Socials">
        <span id="SocialText">Follow Us</span>

        <div class="SocialsList">
            <div class="SocialRow TwitchRow">
                <div class="SocialLogo">
                    <img
                        src="../../../../../assets/Twitch_icon.png"
                        alt="Twitch"
                    />
                </div>
                <span class="SocialNames">Bingothon</span>
            </div>

            <div class="SocialRow YouTubeRow">
                <div class="SocialLogo">
                    <img
                        src="../../../../../assets/youtube-logo.png"
                        alt="YouTube"
                    />
                </div>
                <span class="SocialNames">c/Bingothon</span>
            </div>

            <div class="SocialRow InstaRow">
                <div class="SocialLogo">
                    <img
                        src="../../../../../assets/Instagram_AppIcon_Aug2017.png"
                        alt="Instagram"
                    />
                </div>
                <span class="SocialNames">Bingothon_Marathon</span>
            </div>

            <div class="SocialRow BskyRow">
                <div class="SocialLogo">
                    <img
                        src="../../../../../assets/Bluesky_Logo.svg.png"
                        alt="Bluesky"
                    />
                </div>
                <span class="SocialNames">&#64;Bingothon.com</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';

    const emit = defineEmits(['end']);

    onMounted(() => {
        setTimeout(() => emit('end'), 20 * 1000);
    });
</script>

<style scoped>
    #Socials {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        padding: 20px 0;
    }

    #SocialText {
        font-size: 50px;
        font-weight: bold;
        margin-bottom: 40px;
        text-align: center;
    }

    .SocialsList {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        flex-grow: 1;
        width: fit-content;
    }

    .SocialRow {
        display: flex;
        align-items: center;
        gap: 40px;
    }

    .SocialLogo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 85px;
    }

    .SocialLogo > img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .SocialNames {
        font-size: 50px;
        font-weight: bold;
        white-space: nowrap;
        line-height: 1;
        min-width: 450px;
    }
</style>
