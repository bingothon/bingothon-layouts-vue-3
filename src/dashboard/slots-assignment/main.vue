<template>
    <div>
        <QSelect
            v-model="source"
            :options="SOURCE_OPTIONS"
            @change="updateSource(source)"
        ></QSelect>
        <!-- Nothing to display if source is not set to race -->
        <div v-if="source !== 'race'">
            <div v-if="source === 'run'">Slot assignment is currently disabled due to the wrong mode</div>
            <div v-if="source === 'relay'">
                Slot assignment is currently disabled. Please use speedcontrol's Relay Handler
            </div>
        </div>
        <div v-else>
            <div v-for="(slot, i) in slots">
                <QBtn
                    square
                    :icon="pinIcon(i, slot.pinned)"
                    @mouseenter="hoveredSlot = i"
                    @mouseleave="hoveredSlot = null"
                    @click="togglePin(i, !slot.pinned)"
                />
                <QSelect
                    v-model="slot.playerId"
                    :options="poolOptions"
                    @change="updateSlotPlayer(i, slot.playerId)"
                ></QSelect>
            </div>
            <div>
                <QCheckbox
                    v-model="autoCycleEnabled"
                    label="Auto Cycle"
                    @change="updateAutoCycle"
                />
                <QInput
                    v-if="autoCycleEnabled"
                    v-model="autoCycleInterval"
                    type="number"
                    label="Cycle Interval (seconds)"
                />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { computed, ref } from 'vue';
    import type { PlayerSlots } from '../../../../bingothon-layouts/schemas';
    import { oldBundle, playerSlotsRep, runDataActiveRunReplicant } from '../../browser_shared/replicants';

    // Stupid way to get an exahustive list of all options, will error if a value is missing
    const SOURCE_OPTIONS_MAP: Record<PlayerSlots['source'], boolean> = { run: true, relay: true, race: true };
    const SOURCE_OPTIONS = Object.keys(SOURCE_OPTIONS_MAP);

    const source = computed<PlayerSlots['source']>(() => playerSlotsRep?.data?.source || 'run');

    const slots = computed<PlayerSlots['slots']>(() => playerSlotsRep?.data?.slots || []);

    const hoveredSlot = ref<number | null>(null);

    const autoCycleEnabled = computed(() => playerSlotsRep?.data?.autoCycle || false);
    const autoCycleInterval = computed(() => playerSlotsRep?.data?.cycleIntervalSeconds || 0);

    const poolOptions = computed(() => {
        const allPlayersFlat = runDataActiveRunReplicant?.data?.teams.flatMap((team) => team.players) || [];
        return (
            playerSlotsRep?.data?.pool.map((playerId) => ({
                label: allPlayersFlat.find((player) => player.id === playerId)?.name || playerId,
                value: playerId
            })) || []
        );
    });

    // Shows the current state, but previews the resulting state while hovered/focused.
    function pinIcon(slotIndex: number, pinned: boolean) {
        const showPinned = hoveredSlot.value === slotIndex ? !pinned : pinned;
        return showPinned ? 'mdi-pin' : 'mdi-pin-off';
    }

    function updateSource(source: string) {
        NodeCG.sendMessageToBundle('playerSlots:setSource', oldBundle, source);
    }

    function togglePin(slotIndex: number, pinned: boolean) {
        NodeCG.sendMessageToBundle('playerSlots:setSlotPinned', oldBundle, { slot: slotIndex, pinned });
    }

    function updateSlotPlayer(slotIndex: number, playerId: string | null) {
        NodeCG.sendMessageToBundle('playerSlots:setSlotPlayer', oldBundle, { slot: slotIndex, playerId });
    }

    function updateAutoCycle() {
        NodeCG.sendMessageToBundle('playerSlots:setAutoCycle', oldBundle, {
            autoCycleEnabled: autoCycleEnabled.value,
            intervalSeconds: autoCycleInterval.value
        });
    }
</script>
