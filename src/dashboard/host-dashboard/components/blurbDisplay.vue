<template>
    <div class="q-pa-md">
        <QCard
            flat
            bordered
            class="bg-dark text-white"
        >
            <QCardSection class="row items-center justify-between">
                <div class="text-h6">
                    {{ props.type.charAt(0).toLocaleUpperCase() }}{{ props.type.slice(1) }} Blurbs
                </div>
                <QBadge
                    color="primary"
                    class="q-mr-sm"
                >
                    {{ currentIndex + 1 }} / {{ textItems.length }}
                </QBadge>
            </QCardSection>

            <QSeparator dark />

            <QCarousel
                id="blurbCarousel"
                v-model="currentIndex"
                transition-prev="scale"
                transition-next="scale"
                swipeable
                animated
                infinite
                control-color="white"
                arrows
                class="bg-grey-9 shadow-1 rounded-borders"
            >
                <QCarouselSlide
                    v-for="(item, index) in displayedTexts"
                    :key="index"
                    :name="index"
                    class="blurb-slide"
                >
                    <div class="blurb-slide-content">
                        <QScrollArea class="full-width full-height">
                            <div class="blurb-slide-text text-center text-subtitle1 q-pa-md">
                                {{ item }}
                            </div>
                        </QScrollArea>
                    </div>
                </QCarouselSlide>
            </QCarousel>

            <QCardActions align="right">
                <QBtn
                    flat
                    icon="edit"
                    label="Edit Texts"
                    @click="showEditDialog = true"
                />
            </QCardActions>
        </QCard>

        <QDialog
            v-model="showEditDialog"
            persistent
        >
            <QCard style="min-width: 350px">
                <QCardSection>
                    <div class="text-h6">Manage Blurbs</div>
                </QCardSection>

                <QCardSection class="q-pt-none">
                    <div
                        v-for="(_item, index) in textItems"
                        :key="index"
                        class="row q-mb-sm items-start"
                    >
                        <QInput
                            v-model="blurbsReplicant!.data![props.type][index]"
                            type="textarea"
                            autogrow
                            outlined
                            class="col"
                            :label="`Item ${index + 1}`"
                        />
                        <QBtn
                            flat
                            round
                            color="negative"
                            icon="delete"
                            @click="removeItem(index)"
                        />
                    </div>
                    <QBtn
                        outline
                        label="Add Item"
                        icon="add"
                        class="full-width q-mt-sm"
                        @click="addItem"
                    />
                </QCardSection>

                <QCardActions
                    align="right"
                    class="text-primary"
                >
                    <QBtn
                        v-close-popup
                        flat
                        label="Cancel"
                        @click="handleCancel"
                    />
                    <QBtn
                        v-close-popup
                        flat
                        label="Save Changes"
                        @click="handleSave"
                    />
                </QCardActions>
            </QCard>
        </QDialog>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { blurbsReplicant } from '../../../browser_shared/replicants.ts';

    const props = defineProps<{
        type: 'charity' | 'sponsor' | 'bingothon';
    }>();

    const displayedTexts = computed<string[]>(() => blurbsReplicant?.oldData?.[props.type] ?? []);
    const textItems = computed(() => blurbsReplicant?.data?.[props.type] ?? []);
    const currentIndex = ref(0);
    const showEditDialog = ref(false);

    const handleCancel = () => {
        blurbsReplicant!.revert();
        showEditDialog.value = false;
    };

    const handleSave = async () => {
        if (currentIndex.value >= textItems.value.length) {
            currentIndex.value = Math.max(0, textItems.value.length - 1);
        }
        showEditDialog.value = false;
        blurbsReplicant?.save();
    };

    const addItem = () => blurbsReplicant!.data![props.type].push('');
    const removeItem = (index: number) => blurbsReplicant!.data![props.type].splice(index, 1);
</script>
<style scoped>
    #blurbCarousel {
        min-height: 100px;
        height: auto;
    }

    #blurbCarousel :deep(.blurb-slide) {
        padding: 0;
    }

    #blurbCarousel :deep(.blurb-slide .blurb-slide-content) {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 48px;
    }

    #blurbCarousel :deep(.blurb-slide-text) {
        min-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
