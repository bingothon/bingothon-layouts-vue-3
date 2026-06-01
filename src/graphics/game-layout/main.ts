import { createHead } from '@unhead/vue';
import { createApp } from 'vue';
import '../common.css';
import App from './main.vue';
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import Example from '../example/main.vue';

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
const exampleRoute = { name: 'Example', path: '/example', component: Example };

routes.push({ path: '/', redirect: '/2p-16x9' });
routes.push(exampleRoute);

const router = createRouter({ routes, history: createWebHashHistory() });
app.use(head);
app.use(router);
app.mount('#app');
