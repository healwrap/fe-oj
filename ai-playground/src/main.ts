import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';

createApp(App)
  .provide('apiKey', import.meta.env.VITE_ALI_API_KEY)
  .mount('#app');
