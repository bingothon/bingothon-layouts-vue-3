<template>
    <div class="q-pa-md">
        <QCard
            flat
            bordered
            class="bg-dark text-white"
        >
            <QCardSection class="row items-center justify-between">
                <div class="text-h6 text-capitalize">{{ props.type }} Blurbs</div>
                <div class="row items-center">
                    <QSelect
                        v-if="!isPrimary && availableLanguages.length > 0"
                        :model-value="activeLanguage"
                        :options="availableLanguages"
                        dense
                        outlined
                        dark
                        label="Language"
                        class="q-mr-sm"
                        style="min-width: 120px"
                        @update:model-value="selectedLanguage = $event"
                    />
                    <QBadge
                        color="primary"
                        class="q-mr-sm"
                    >
                        {{ currentIndex + 1 }} / {{ displayedTexts.length }}
                    </QBadge>
                </div>
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

            <QCardActions
                v-if="isPrimary"
                align="right"
            >
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
            seamless
        >
            <QCard style="min-width: 900px">
                <QCardSection>
                    <div class="text-h6 text-capitalize">Manage {{ props.type }} Blurbs</div>
                </QCardSection>

                <QCardSection class="q-pt-none">
                    <div
                        v-for="(_item, index) in textItems"
                        :key="index"
                        class="q-mb-md"
                    >
                        <div class="row q-mb-xs items-start">
                            <QInput
                                v-model="blurbsReplicant!.data![props.type][index].text"
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
                            <QCheckbox
                                v-model="blurbsReplicant!.data![props.type][index].enabled"
                                color="positive"
                                label="Enabled"
                                class="q-ml-md"
                            />
                        </div>
                        <!-- Translations editing -->
                        <div class="q-ml-lg q-mt-xs">
                            <div class="text-caption text-grey q-mb-xs">Translations</div>
                            <div
                                v-for="lang in getTranslationKeys(index)"
                                :key="lang"
                                class="row q-mb-xs items-center"
                            >
                                <QInput
                                    :model-value="lang"
                                    outlined
                                    dense
                                    readonly
                                    class="q-mr-sm"
                                    style="max-width: 100px"
                                />
                                <QInput
                                    v-model="blurbsReplicant!.data![props.type][index].translations![lang]"
                                    type="textarea"
                                    autogrow
                                    outlined
                                    dense
                                    class="col"
                                    :label="`Translation (${lang})`"
                                />
                                <QBtn
                                    flat
                                    round
                                    dense
                                    color="negative"
                                    icon="remove_circle"
                                    @click="removeTranslation(index, lang)"
                                />
                            </div>
                            <div class="row q-mt-xs items-center">
                                <QInput
                                    v-model="newLangKey[index]"
                                    outlined
                                    dense
                                    label="Language key"
                                    class="q-mr-sm"
                                    style="max-width: 100px"
                                />
                                <QBtn
                                    outline
                                    dense
                                    label="Add Translation"
                                    icon="translate"
                                    :disable="!newLangKey[index]"
                                    @click="addTranslation(index)"
                                />
                            </div>
                        </div>
                        <QSeparator class="q-mt-sm" />
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
    import { computed, reactive, ref } from 'vue';
    import { blurbsReplicant } from '../../../browser_shared/replicants.ts';

    const props = defineProps<{
        type: 'charity' | 'sponsor' | 'bingothon';
        isPrimary?: boolean;
    }>();

    const selectedLanguage = ref<string | null>(null);

    const availableLanguages = computed<string[]>(() => {
        const blurbs = blurbsReplicant?.oldData?.[props.type] ?? [];
        const langSet = new Set<string>();
        for (const item of blurbs) {
            if (item.translations) {
                for (const key of Object.keys(item.translations)) {
                    langSet.add(key);
                }
            }
        }
        return [...langSet].sort();
    });

    const activeLanguage = computed(() => selectedLanguage.value ?? availableLanguages.value[0] ?? null);

    const displayedTexts = computed<string[]>(() => {
        const typeBlurbs = blurbsReplicant?.oldData?.[props.type];
        if (!typeBlurbs) return [];

        const enabledItems = typeBlurbs.filter((item: { text: string; enabled: boolean }) => item.enabled);

        if (!props.isPrimary && activeLanguage.value) {
            return enabledItems.map(
                (item: { text: string; enabled: boolean; translations?: { [k: string]: string } }) =>
                    item.translations?.[activeLanguage.value!] ?? item.text
            );
        }

        return enabledItems.map((item: { text: string; enabled: boolean }) => item.text);
    });

    const textItems = computed(() => blurbsReplicant?.data?.[props.type] ?? []);
    const currentIndex = ref(0);
    const showEditDialog = ref(false);
    const newLangKey = reactive<Record<number, string>>({});

    const getTranslationKeys = (index: number): string[] => {
        const item = blurbsReplicant?.data?.[props.type]?.[index];
        return item?.translations ? Object.keys(item.translations).sort() : [];
    };

    const addTranslation = (index: number) => {
        const key = newLangKey[index]?.trim();
        if (!key) return;
        const item = blurbsReplicant?.data?.[props.type]?.[index];
        if (item) {
            if (!item.translations) item.translations = {};
            item.translations[key] = '';
            newLangKey[index] = '';
        }
    };

    const removeTranslation = (index: number, lang: string) => {
        const item = blurbsReplicant?.data?.[props.type]?.[index];
        if (item?.translations) {
            delete item.translations[lang];
        }
    };

    const handleCancel = () => {
        blurbsReplicant?.revert();
        showEditDialog.value = false;
    };

    const handleSave = async () => {
        if (currentIndex.value >= displayedTexts.value.length) {
            currentIndex.value = Math.max(0, displayedTexts.value.length - 1);
        }
        showEditDialog.value = false;
        blurbsReplicant?.save();
    };

    const addItem = () => blurbsReplicant?.data?.[props.type].push({ text: '', enabled: true });
    const removeItem = (index: number) => blurbsReplicant?.data?.[props.type].splice(index, 1);
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
