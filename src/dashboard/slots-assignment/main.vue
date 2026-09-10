<template>
    <div class="q-pa-md column q-gutter-md text-white">
        <div class="row items-center q-gutter-sm">
            <QIcon
                name="mdi-account-group"
                size="sm"
            />
            <div class="text-h6">Player Slots</div>
            <QSpace />
            <QChip
                dense
                square
                color="primary"
                text-color="white"
                :label="`${slots.length} slot${slots.length === 1 ? '' : 's'}`"
            />
        </div>

        <QSelect
            :model-value="source"
            :options="SOURCE_OPTIONS"
            label="Source"
            outlined
            dark
            dense
            emit-value
            map-options
            @update:model-value="updateSource"
        />

        <QBanner
            v-if="source !== 'race'"
            dense
            rounded
            class="bg-grey-9 text-white"
        >
            <template #avatar>
                <QIcon
                    name="mdi-information-outline"
                    color="amber"
                />
            </template>
            <span v-if="source === 'run'">
                Slots follow the run order automatically. Switch to <b>race</b> to assign players manually.
            </span>
            <span v-else> Slot assignment is disabled in relay mode. Please use speedcontrol's Relay Handler. </span>
        </QBanner>

        <template v-else>
            <QBanner
                v-if="!slots.length"
                dense
                rounded
                class="bg-grey-9 text-white"
            >
                No slots available. Check that a run is active and a game layout is selected.
            </QBanner>

            <QList
                v-else
                bordered
                separator
                dark
                class="rounded-borders"
            >
                <QItem
                    v-for="(slot, i) in slots"
                    :key="i"
                >
                    <QItemSection
                        side
                        class="slot-index"
                    >
                        {{ i + 1 }}
                    </QItemSection>
                    <QItemSection>
                        <QSelect
                            :model-value="slot.playerId"
                            :options="poolOptions"
                            :label="`Slot ${i + 1}`"
                            outlined
                            dark
                            dense
                            emit-value
                            map-options
                            @update:model-value="(playerId: string | null) => updateSlotPlayer(i, playerId)"
                        />
                    </QItemSection>
                    <QItemSection side>
                        <QBtn
                            round
                            flat
                            dense
                            :icon="pinIcon(i, slot.pinned)"
                            :color="slot.pinned ? 'primary' : 'grey-6'"
                            @mouseenter="hoveredSlot = i"
                            @mouseleave="hoveredSlot = null"
                            @click="togglePin(i, !slot.pinned)"
                        >
                            <QTooltip>
                                {{ slot.pinned ? 'Unpin (slot rejoins the rotation)' : 'Pin (slot keeps its player)' }}
                            </QTooltip>
                        </QBtn>
                    </QItemSection>
                </QItem>
            </QList>

            <QSeparator dark />

            <div class="row items-center q-gutter-md">
                <QToggle
                    :model-value="autoCycleEnabled"
                    label="Auto cycle"
                    color="primary"
                    @update:model-value="setAutoCycle"
                />
                <!-- v-if="autoCycleEnabled"-->
                <QInput
                    :style="{ visibility: autoCycleEnabled ? 'visible' : 'hidden' }"
                    :model-value="cycleIntervalSeconds"
                    type="number"
                    :min="MIN_CYCLE_INTERVAL_S"
                    label="Interval (s)"
                    outlined
                    dark
                    dense
                    debounce="500"
                    class="interval-input"
                    @update:model-value="setCycleInterval"
                />
                <QSpace />
                <div class="row items-center q-gutter-sm">
                    <QBtn
                        color="primary"
                        unelevated
                        icon="mdi-rotate-right"
                        label="Cycle now"
                        :disable="!slots.length"
                        @click="cycleNow"
                    />
                </div>
                <span
                    v-if="nextCycleTimestamp"
                    class="text-caption text-grey-4"
                    >Next auto cycle in: {{ nextCycleTimestamp }}</span
                >
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import type { PlayerSlots } from '../../../../bingothon-layouts/schemas';
    import { oldBundle, playerSlotsRep, runDataActiveRunReplicant } from '../../browser_shared/replicants';

    const MIN_CYCLE_INTERVAL_S = 5;

    // Date.now() is not reactive so we need a periodic timer update the ref to update the last cycle time.
    const currentTime = ref(Date.now());
    let timer: number | null = null;

    onMounted(() => {
        timer = window.setInterval(() => {
            currentTime.value = Date.now();
        }, 1000);
    });

    onUnmounted(() => {
        if (timer) clearInterval(timer);
    });

    // Exhaustive map, so adding a source to the schema fails to compile until it is labelled here.
    const SOURCE_LABELS: Record<PlayerSlots['source'], string> = {
        run: 'Run — slots mirror the flat run order',
        relay: 'Relay — one slot per team',
        race: 'Race — sliding window over the player pool'
    };
    const SOURCE_OPTIONS = (Object.keys(SOURCE_LABELS) as PlayerSlots['source'][]).map((value) => ({
        label: SOURCE_LABELS[value],
        value
    }));

    const source = computed<PlayerSlots['source']>(() => playerSlotsRep?.data?.source ?? 'run');

    const slots = computed<PlayerSlots['slots']>(() => playerSlotsRep?.data?.slots ?? []);

    const nextCycleTimestamp = computed<string>(() => {
        const lastTimestamp = playerSlotsRep?.data?.lastCycle;
        if (!lastTimestamp || !autoCycleEnabled.value || cycleIntervalSeconds.value <= 0) {
            return '';
        }
        const remainingMs = Math.max(0, cycleIntervalSeconds.value * 1000 - (currentTime.value - lastTimestamp));
        const remainingS = Math.floor(remainingMs / 1000);
        const timestampMin = Math.floor(remainingS / 60);
        const timestampSec = remainingS % 60;
        return `${timestampMin}:${timestampSec < 10 ? '0' : ''}${timestampSec}`;
    });

    const hoveredSlot = ref<number | null>(null);

    const autoCycleEnabled = computed(() => playerSlotsRep?.data?.autoCycle ?? false);
    const cycleIntervalSeconds = computed(() => playerSlotsRep?.data?.cycleIntervalSeconds ?? 0);

    const poolOptions = computed(() => {
        const allPlayersFlat = runDataActiveRunReplicant?.data?.teams?.flatMap((team) => team.players) ?? [];
        return (playerSlotsRep?.data?.pool ?? []).map((playerId) => ({
            label: allPlayersFlat.find((player) => player.id === playerId)?.name || playerId,
            value: playerId
        }));
    });

    // Shows the current state, but previews the resulting state while hovered/focused.
    function pinIcon(slotIndex: number, pinned: boolean) {
        const showPinned = hoveredSlot.value === slotIndex ? !pinned : pinned;
        return showPinned ? 'mdi-pin' : 'mdi-pin-off';
    }

    function updateSource(newSource: PlayerSlots['source']) {
        nodecg.sendMessageToBundle('playerSlots:setSource', oldBundle, newSource);
    }

    function togglePin(slotIndex: number, pinned: boolean) {
        nodecg.sendMessageToBundle('playerSlots:setSlotPinned', oldBundle, { slot: slotIndex, pinned });
    }

    function updateSlotPlayer(slotIndex: number, playerId: string | null) {
        nodecg.sendMessageToBundle('playerSlots:setSlotPlayer', oldBundle, { slot: slotIndex, playerId });
    }

    function cycleNow() {
        nodecg.sendMessageToBundle('playerSlots:cycleNow', oldBundle);
    }

    function setAutoCycle(enabled: boolean) {
        if (!playerSlotsRep?.data) return;
        playerSlotsRep.data.autoCycle = enabled;
        playerSlotsRep.save();
        nodecg.sendMessageToBundle('playerSlots:setAutoCycle', oldBundle, {
            enabled,
            intervalSeconds: playerSlotsRep.data.cycleIntervalSeconds
        });
    }

    function setCycleInterval(value: string | number | null) {
        if (!playerSlotsRep?.data) return;
        const seconds = Math.max(MIN_CYCLE_INTERVAL_S, Math.round(Number(value)));
        if (!Number.isFinite(seconds) || seconds === playerSlotsRep.data.cycleIntervalSeconds) return;
        playerSlotsRep.data.cycleIntervalSeconds = seconds;
        playerSlotsRep.save();
        if (playerSlotsRep.data.autoCycle) {
            // Restart the running timer so the new interval takes effect immediately.
            nodecg.sendMessageToBundle('playerSlots:setAutoCycle', oldBundle, {
                enabled: true,
                intervalSeconds: seconds
            });
        }
    }
</script>

<style scoped>
    .slot-index {
        min-width: 24px;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.6);
    }

    .interval-input {
        max-width: 140px;
    }
</style>
