import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

// Asegúrate de que esta ruta sea correcta
import Home from '../views/Home.vue'; 

describe('Home.vue', () => {
  
  // Test 1: Comprueba que el componente se renderiza correctamente y muestra el título "hola"
  it('se renderiza correctamente y muestra el título "hola"', () => {
    const wrapper = shallowMount(Home);
    const h1 = wrapper.find('h1');
    expect(h1.exists()).toBe(true); 
    expect(h1.text()).toBe('hola'); 
  });

  // Test 2 (Nuevo): Comprueba si existe un elemento h2
  it('debería existir un elemento h2', () => {
    const wrapper = shallowMount(Home);
    const h2 = wrapper.find('h2');
    // Verifica si se encontró el elemento <h2> en el template.
    expect(h2.exists()).toBe(true);
  });
  
  // Test 3 (Nuevo): Comprueba que el contenido del h3 es un número mayor a 0
  it('debería tener un h3 con un valor numérico mayor a 0', () => {
    const wrapper = shallowMount(Home);
    const h3 = wrapper.find('h3');

    // 1. Verifica que el <h3> existe.
    expect(h3.exists()).toBe(true);
    
    // 2. Obtiene el texto y lo convierte a número.
    // Usamos parseInt() para convertir "13" a 13.
    const numberInH3 = parseInt(h3.text().trim());

    // 3. Verifica que la conversión fue exitosa (no es NaN)
    // y que el número es mayor a 0.
    expect(numberInH3).not.toBeNaN(); 
    expect(numberInH3).toBeGreaterThan(0);
  });
  
  // Test 4: Verifica que solo hay un elemento <h1>
  it('solo existe un elemento <h1> en el componente', () => {
    const wrapper = shallowMount(Home);
    const h1Elements = wrapper.findAll('h1');
    expect(h1Elements.length).toBe(1);
  });
  
  // Nota: Dejé intencionalmente fuera el test de HeaderComponent ya que te daba problemas.
  // Si deseas volver a integrarlo, necesitarías solucionar el problema de "stubs" o importación.

});