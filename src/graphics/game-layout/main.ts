import { createHead } from '@unhead/vue';
import { createApp, watch } from 'vue';
import '../common.css';
import App from './main.vue';
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { allGameLayoutsReplicant, currentGameLayoutReplicant, waitForComposable } from '../../browser_shared/replicants.ts';
import type { CurrentGameLayout } from '../../../../bingothon-layouts/schemas/currentGameLayout';

const layouts = import.meta.glob('./layouts/*.vue');

const routes: RouteRecordRaw[] = Object.keys(layouts).map((fullPath) => {
    const path = fullPath.replace('./layouts/', '').replace('.vue', '');
    console.log(path);
    return {
        name: path.replace('-', ' '),
        path: `/${path}`,
        component: layouts[fullPath]
    };
});

const app = createApp(App);
const head = createHead();

await waitForComposable(allGameLayoutsReplicant);
allGameLayoutsReplicant!.data! = routes.map((route) => {
    return {
        name: route.name as string,
        path: route.path,
        id: route.path.replace('/', '')
    };
});
allGameLayoutsReplicant!.save();

// Redirect needs to be done after mapping the routes to the replicant
routes.push({ path: '/:pathMatch(.*)*', redirect: '/1p-16x9' });

watch(
    () => currentGameLayoutReplicant!.data!,
    async (newLayout: CurrentGameLayout | undefined) => {
        if (!newLayout) return;
        if (allGameLayoutsReplicant?.data?.map((layout) => layout.name).includes(newLayout.name)) {
            await router.push({ name: newLayout.name });
        } else {
            await router.push('/1p-16x9');
        }
    }
);

const router = createRouter({ routes, history: createWebHashHistory() });
app.use(head);
app.use(router);
app.mount('#app');
