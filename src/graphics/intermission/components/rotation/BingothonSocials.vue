<template>
    <div id="Socials">
        <span id="SocialText">Follow Us</span>
        <table id="SocialsTable">
            <tbody>
                <tr class="FlexContainer TwitchRow">
                    <td>
                        <div id="TwitchLogo">
                            <img src="../../../../../assets/Twitch_icon.png" />
                        </div>
                    </td>
                    <td class="SocialNames">Bingothon</td>
                </tr>
                <tr class="FlexContainer YouTubeRow">
                    <td>
                        <div id="YouTubeLogo">
                            <img src="../../../../../assets/youtube-logo.png" />
                        </div>
                    </td>
                    <td class="SocialNames">c/Bingothon</td>
                </tr>
                <tr class="FlexContainer InstaRow">
                    <td>
                        <div id="InstaLogo">
                            <img src="../../../../../assets/Instagram_AppIcon_Aug2017.png" />
                        </div>
                    </td>
                    <td class="SocialNames">Bingothon_Marathon</td>
                </tr>
                <tr class="FlexContainer BskyRow">
                    <td>
                        <div id="BskyLogo">
                            <img src="../../../../../assets/Bluesky_Logo.svg.png" />
                        </div>
                    </td>
                    <td class="SocialNames">&#64;Bingothon.com</td>
                </tr>
            </tbody>
        </table>
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
    #SocialText {
        position: absolute;
        align-content: center;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        top: 0px;
        left: 470px;
        font-size: 50px;
    }

    #SocialsTable {
        position: absolute;
        top: 80px;
    }

    #Socials {
        position: absolute;
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        justify-content: space-around;
    }

    #TwitchLogo > img {
        position: absolute;
        top: 0px;
        left: 250px;
        height: 85px;
    }

    #YouTubeLogo > img {
        position: absolute;
        top: 120px;
        left: 240px;
        height: 98px;
    }

    #InstaLogo > img {
        position: absolute;
        top: 240px;
        left: 250px;
        height: 85px;
    }

    #BskyLogo > img {
        position: absolute;
        top: 360px;
        left: 250px;
        height: 85px;
    }

    .SocialNames {
        margin-left: 300px;
        font-size: 50px;
        font-weight: bold;
        margin-bottom: 60px;
        align-content: flex-start;
    }
</style>
