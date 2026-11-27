import { createHead } from '@unhead/vue';
import { createApp } from 'vue';
import { Dark, Quasar } from 'quasar';
import 'quasar/src/css/index.sass';
import '../common.css';
import App from './main.vue';

const app = createApp(App);
const head = createHead();
app.use(Quasar);
app.use(head);
app.mount('#app');
Dark.set(true);
