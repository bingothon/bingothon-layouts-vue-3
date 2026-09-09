<template>
    <div>
        <QChip
            :color="statusColor"
            :icon="statusIcon"
        >
            {{ connectedTo }}
        </QChip>
        <div class="q-mt-sm">
            <QBtn
                v-if="obsConnectionStatus != 'disconnected'"
                color="red"
                @click="doDisconnect"
            >
                Disconnect
            </QBtn>
        </div>
        <hr />
        <QSelect
            v-model="formState"
            :options="connectionTypes"
            dense
            outlined
            dark
            label="Connection Type"
        >
        </QSelect>
        <div v-if="formState == 'preset'">
            <QSelect
                v-model="selectedPreset"
                :options="availablePresets"
                dense
                outlined
                dark
                class="q-mt-sm"
                :disable="isConnecting"
                label="Connection Preset"
            />
        </div>
        <div v-if="formState == 'custom'">
            <QInput
                v-model="manualUrl"
                :disable="isConnecting"
                :rules="[
                    (val) => !!val || 'Field is required',
                    (val) => val?.startsWith('ws') || 'Needs to start with \'ws\''
                ]"
                label="Address (including ws(s)://)"
            />
            <QInput
                v-model="manualPassword"
                :disable="isConnecting"
                type="password"
                :rules="[(val) => !!val || 'Field is required']"
                label="Password"
            />
        </div>
        <div class="OpenFormButtons q-mt-sm">
            <div
                v-if="errorMsg"
                style="color: red"
            >
                {{ errorMsg }}
            </div>
            <QBtn
                color="green"
                :disable="isConnecting"
                @click="doConnect"
            >
                Connect
            </QBtn>
        </div>
    </div>
    <!-- TODO: own panel? -->
    <hr />
    <QSelect
        :model-value="currentObsStreamSourceType"
        :options="allObsStreamSourceTypes"
        dense
        outlined
        dark
        label="OBS Stream Source Type"
        @update:model-value="useObsStreamSourceType($event)"
    />
</template>

<script setup lang="ts">
    import { useHead } from '@unhead/vue';
    import { computed, ref, type Ref } from 'vue';
    import type { ObsConnectionPresets, ObsStreamSourceType } from '../../../../bingothon-layouts/schemas';
    import {
        obsConnectionPresetsReplicant,
        obsConnectionReplicant,
        obsStreamSourceTypeReplicant,
        oldBundle
    } from '../../browser_shared/replicants';

    useHead({ title: 'OBS Connection' });

    const formState: Ref<'custom' | 'preset'> = ref('custom');
    const connectionTypes = ['custom', 'preset'];
    // TODO: get from config
    const availablePresets = computed(() => obsConnectionPresetsReplicant?.data ?? []);
    const selectedPreset: Ref<ObsConnectionPresets | null> = ref(availablePresets.value ?? null);
    const manualUrl = ref('');
    const manualPassword = ref('');
    const isConnecting = ref(false);
    const errorMsg = ref('');

    const obsConnectionStatus = computed(() => obsConnectionReplicant?.data?.status);
    const statusColor = computed(() => {
        switch (obsConnectionStatus.value) {
            case 'connected':
                return 'green';
            case 'connecting':
                return 'yellow';
            case 'disabled':
            case 'disconnected':
                return 'grey-8';
            case 'error':
                return 'red';
            default:
                return 'unknown';
        }
    });
    const statusIcon = computed(() => {
        switch (obsConnectionStatus.value) {
            case 'connected':
                return 'check_circle';
            case 'connecting':
                return 'trending_up';
            case 'error':
                return 'error';
            default:
            case 'disabled':
            case 'disconnected':
                return 'disabled_by_default';
        }
    });

    const connectedTo = computed(
        () => obsConnectionReplicant?.data?.preset ?? obsConnectionReplicant?.data?.url ?? 'disconnected'
    );

    function doConnect() {
        switch (formState.value) {
            case 'custom': {
                isConnecting.value = true;
                errorMsg.value = '';
                NodeCG.sendMessageToBundle('obs:connect', oldBundle, {
                    url: manualUrl.value,
                    password: manualPassword.value
                })
                    .catch((e) => (errorMsg.value = e.message))
                    .finally(() => (isConnecting.value = false));
                return;
            }
            case 'preset': {
                isConnecting.value = true;
                errorMsg.value = '';
                NodeCG.sendMessageToBundle('obs:connectPreset', oldBundle, { preset: selectedPreset.value })
                    .catch((e) => (errorMsg.value = e.message))
                    .finally(() => (isConnecting.value = false));
                return;
            }
        }
    }

    function doDisconnect() {
        if (confirm('are you sure you want to disconnect from OBS?')) {
            NodeCG.sendMessageToBundle('obs:disconnect', oldBundle);
        }
    }

    const allObsStreamSourceTypes: ObsStreamSourceType[] = [
        'obsStreamlinkMediasource',
        'obsTwitchPlayer',
        'obsSrtMediasource'
    ];
    const currentObsStreamSourceType = computed(() => obsStreamSourceTypeReplicant?.data);
    function useObsStreamSourceType(typ: ObsStreamSourceType) {
        if (obsStreamSourceTypeReplicant && confirm(`are you sure you want to use ${typ}?`)) {
            obsStreamSourceTypeReplicant.data = typ;
            obsStreamSourceTypeReplicant.save();
        }
    }
</script>

<style>
    .ConnectionStatus.error {
        color: red;
    }
</style>
