import { createHead } from '@unhead/vue';
import { createApp } from 'vue';
import '../common.css';
import App from './main.vue';
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router';

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
// const exampleRoute = { name: 'Example', path: '/', component: Example };

routes.push({ path: '/', redirect: '/1p-16x9' });

// routes.push(exampleRoute);

const router = createRouter({ routes, history: createMemoryHistory() });
app.use(head);
app.use(router);
app.mount('#app');
