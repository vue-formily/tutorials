import { createApp } from 'vue'
import "tailwindcss/dist/tailwind.css";
import { createFormily } from '@vue-formily/formily';

const formily = createFormily();

import App from './App.vue'

const app = createApp(App)

app.use(formily);

app.mount('#app')
