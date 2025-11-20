import { createApp } from 'vue';
import App from './App.vue';
// Importa tu archivo CSS o de estilos globales aquí:
// import './assets/main.css'; 

// La línea de abajo asegura que el contenido de App.vue se renderice
// dentro del div con el ID="app" que está en tu index.html.
createApp(App).mount('#app');