import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App)
  .provide('apiKey', import.meta.env.VITE_ALI_API_KEY)
  .mount('#app');
