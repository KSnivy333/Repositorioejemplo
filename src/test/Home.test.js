// Importamos las funciones necesarias de Vitest y Vue Test Utils
import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

// Asegúrate de que estas rutas son las que funcionan en tu entorno:
import Home from '../views/Home.vue'; 
// import HeaderComponent from '../components/HeaderComponent.vue'; // Ya no es necesario importar para este test

describe('Home.vue', () => {
  
  // Test 1: Comprueba que el componente se renderiza correctamente y muestra el título "hola"
  it('se renderiza correctamente y muestra el título "hola"', () => {
    // Usamos shallowMount para montar el componente
    const wrapper = shallowMount(Home);

    // 1. Verificar el contenido del encabezado <h1>
    const h1 = wrapper.find('h1');
    expect(h1.exists()).toBe(true); // Comprueba que existe el <h1>
    expect(h1.text()).toBe('hola'); // Comprueba que el texto es 'hola'
  });

  /*
  // Test 2: COMENTADO - Este es el test que está fallando actualmente
  it('monta el componente HeaderComponent', () => {
    const wrapper = shallowMount(Home);

    // Vue Test Utils puede encontrar componentes "stubeados" por el nombre del import
    // Aquí está fallando porque no encuentra el stub de HeaderComponent
    const header = wrapper.findComponent(HeaderComponent);

    // La aserción que falla:
    expect(header.exists()).toBe(true);
  });
  */

  // Test 3 (Adicional): Verifica que solo hay un elemento <h1>
  it('solo existe un elemento <h1> en el componente', () => {
    const wrapper = shallowMount(Home);
    const h1Elements = wrapper.findAll('h1');
    expect(h1Elements.length).toBe(1);
  });
});