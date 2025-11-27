// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// ... (posiblemente importaciones de router, pinia, etc.)

createApp(App)
  // .use(router) // Si tienes Vue Router
  .mount('#app'); // Monta App.vue en el div con id="app"