<template>
    <div
        v-if="isShown"
        class="twitch-clip-embed"
    >
        <iframe
            :key="iframeKey"
            :src="twitchClipUrl"
            allow="fullscreen"
        >
        </iframe>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, onMounted } from 'vue';

    let isShown: boolean = false; // This is the new data property for internal visibility control
    let twitchClipSlug: string = '';
    let durationInMilliseconds: number | null = null;
    let iframeKey: number = 0;

    // Uses the internal twitchClipSlug to construct the iframe URL
    const twitchClipUrl = computed(
        () => `https://clips.twitch.tv/embed?clip=${twitchClipSlug}&parent=dash.bingothon.com&autoplay=true`
    );

    onMounted(() => {
        nextTick(() => {
            nodecg.listenFor('playTwitchClip', playClip);
            nodecg.listenFor('stopTwitchClip', stopClip);
        });
    });

    async function fetchTwitchClipDuration(slug: string) {
        // Construct the request data object for the twitchAPIRequest
        const requestData = {
            method: 'GET', // HTTP method for the request
            endpoint: `/clips?id=${slug}`, // Twitch API endpoint for clips
            data: {}, // Additional data for the request, if needed
            newAPI: true // Specify if this is for the new Twitch API
        };

        try {
            // Wrap the sendMessageToBundle call in a Promise to be able to use await
            const response = await new Promise((resolve, reject) => {
                nodecg.sendMessageToBundle(
                    'twitchClipDurationRequest',
                    'nodecg-speedcontrol',
                    requestData,
                    (err, response) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(response);
                        }
                    }
                );
            });

            // Process the response to set the clip duration
            if (response) {
                durationInMilliseconds = parseFloat(response as string) * 1000;
            } else {
                durationInMilliseconds = 60 * 1000;
            }
        } catch (error) {
            console.error('Caught error:', error);
        }
    }

    function playClip(slug: string) {
        twitchClipSlug = slug;
        isShown = true;
        iframeKey++; // reset iframe to force reload because people might want to repeat the same clip a couple of times

        // Replace clientId and accessToken with actual values
        fetchTwitchClipDuration(slug).then(() => {
            setTimeout(
                () => {
                    isShown = false;
                },
                durationInMilliseconds || 60 * 1000
            );
        });
    }

    function stopClip() {
        isShown = false; // Use the internal property instead of the prop
    }
</script>

<style scoped>
    .twitch-clip-embed {
        position: absolute;
        left: 718px;
        top: 240px;
        width: 1172px;
        height: 660px;
    }
</style>
