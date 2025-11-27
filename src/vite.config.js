// vite.config.js (o .ts)

import { defineConfig } from 'vite'

export default defineConfig({
  // ... plugins y otras configuraciones ...
  test: {
    environment: 'jsdom',
    // La ruta debe ser relativa a la raíz del proyecto donde se ejecuta el comando `vitest`
    setupFiles: ['./tests/setup.js'], // Asegúrate de que esta ruta sea correcta
  },
});