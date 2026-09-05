<template>
    <div>
        <div
            class="ConnectionStatus"
            :class="obsStatusClass"
        >
            {{ statusStr }} {{ connectedTo }}
        </div>
        <div
            v-if="formState == 'none'"
            class="OpenFormButtons"
        >
            <QBtn @click="() => (formState = 'custom')">Connect manual</QBtn>
            <QBtn @click="() => (formState = 'preset')">Connect preset</QBtn>
        </div>
        <div v-if="formState == 'preset'">
            <QSelect
                v-model="selectedPreset"
                :options="availablePresets"
                :disable="isConnecting"
                :dense="true"
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
        <div
            v-if="formState != 'none'"
            class="OpenFormButtons"
        >
            <div
                v-if="errorMsg"
                style="color: red"
            >
                {{ errorMsg }}
            </div>
            <QBtn
                :disable="isConnecting"
                @click="() => (formState = 'none')"
                >Cancel</QBtn
            >
            <QBtn
                :disable="isConnecting"
                @click="doConnect"
                >Connect</QBtn
            >
        </div>
        <QBtn
            v-if="obsStatusClass != 'disconnected'"
            @click="doDisconnect"
            >Disconnect</QBtn
        >
    </div>
    <!-- TODO: own panel? -->
    <hr />
    <div>currently using {{ obsStreamSourceTypeReplicant?.data }}</div>
    <QBtn
        v-for="sourceType in allNotInUse"
        :key="sourceType"
        @click="() => useObsStreamSourceType(sourceType)"
        >Use {{ sourceType }}</QBtn
    >
</template>

<script setup lang="ts">
    import { useHead } from '@unhead/vue';
    import { computed, ref, type Ref } from 'vue';
    import type { ObsStreamSourceType } from '../../../../bingothon-layouts/schemas';
    import {
        obsConnectionPresetsReplicant,
        obsConnectionReplicant,
        obsStreamSourceTypeReplicant,
        oldBundle
    } from '../../browser_shared/replicants';

    useHead({ title: 'OBS Connection' });

    const formState: Ref<'none' | 'custom' | 'preset'> = ref('none');
    const selectedPreset: Ref<string | null> = ref(null);
    const manualUrl = ref('');
    const manualPassword = ref('');
    const isConnecting = ref(false);
    const errorMsg = ref('');

    const obsStatusClass = computed(() => obsConnectionReplicant?.data?.status);
    const statusStr = computed(() => {
        const status = obsConnectionReplicant?.data?.status;
        switch (status) {
            case 'connected':
                return 'connected to';
            case 'connecting':
                return 'connecting to';
            case 'disabled':
                return 'disabled';
            case 'disconnected':
                return 'disconnected';
            case 'error':
                return 'error connecting to';
            default:
                return 'unknown';
        }
    });

    const connectedTo = computed(() => {
        let result = obsConnectionReplicant?.data?.url;
        if (!result) {
            return null;
        }
        const preset = obsConnectionReplicant?.data?.preset;
        if (preset) {
            result = `${result} (${preset})`;
        }
        return result;
    });

    // TODO: get from config
    const availablePresets = computed(() => obsConnectionPresetsReplicant?.data ?? []);

    function doConnect() {
        switch (formState.value) {
            case 'custom': {
                isConnecting.value = true;
                errorMsg.value = '';
                NodeCG.sendMessageToBundle('obs:connect', oldBundle, {
                    url: manualUrl.value,
                    password: manualPassword.value
                })
                    .then(() => (formState.value = 'none'))
                    .catch((e) => (errorMsg.value = e.message))
                    .finally(() => (isConnecting.value = false));
                return;
            }
            case 'preset': {
                isConnecting.value = true;
                errorMsg.value = '';
                NodeCG.sendMessageToBundle('obs:connectPreset', oldBundle, { preset: selectedPreset.value })
                    .then(() => (formState.value = 'none'))
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
    const allNotInUse = computed(() => allObsStreamSourceTypes.filter((t) => t !== obsStreamSourceTypeReplicant?.data));
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
