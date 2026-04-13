<template>
    <div class="SponsorLogoRotation">
        <transition
            name="fade"
            mode="out-in"
        >
            <img
                v-if="currentLogo"
                :key="currentLogo.url"
                :src="currentLogo.url"
            />
        </transition>
    </div>
</template>

<script lang="ts">
    export enum LogoAssetType {
        wideSmallLogos = 'wideSmallLogos',
        wideLargeLogos = 'wideLargeLogos',
        squareLogos = 'squareLogos'
    }
</script>
<script setup lang="ts">
    import { useDynamicReplicant } from 'nodecg-vue-composable';
    import { computed, onUnmounted, ref } from 'vue';
    import { type Asset } from '../../../../bingothon-layouts/schemas';
    import { oldBundle } from '../../browser_shared/replicants';

    const ROTATION_INTERVAL_SECS = 15;

    const props = withDefaults(
        defineProps<{
            logoAssetType: LogoAssetType;
        }>(),
        {
            logoAssetType: LogoAssetType.wideSmallLogos
        }
    );

    const assetReplicantName = computed(() => `assets:${props.logoAssetType}`);
    const assetStore = useDynamicReplicant<Asset>(assetReplicantName, oldBundle, null);

    const currentIdx = ref(0);
    const currentLogo = computed(() => assetStore.value.data?.[currentIdx.value]);
    const changeInterval = setInterval(() => {
        if (assetStore.value.data.length > 0) {
            currentIdx.value = (currentIdx.value + 1) % assetStore.value.data.length;
        }
    }, ROTATION_INTERVAL_SECS * 1000);

    onUnmounted(() => {
        clearInterval(changeInterval);
    });
</script>

<style scoped>
    img {
        height: 90%;
        width: 90%;
        object-fit: scale-down;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
    }

    /* local animation stuff */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.75s;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
