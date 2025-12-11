import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';

/**
 * Archivo de pruebas: `Testpoke.test.js`
 * - Contiene tests unitarios para `HomeView.vue` y `PokemonDetail.vue`.
 * - Se usan mocks para `fetch` (llamadas a la API) y para el router shim
 *   (funciones `useRoute` / `useRouter`) para controlar parámetros y navegación.
 */

// --- Mock del router shim --------------------------------------------------
// Many components import `../router/shim` to use `useRoute` / `useRouter`.
// Aquí lo mockeamos para que las pruebas no dependan del router real.
// - `useRoute` devuelve un `ref` simulado con params `{ id: '1' }`.
// - `useRouter` devuelve un objeto con `push` que podemos espiar (`pushMock`).
const pushMock = vi.fn();
vi.mock('../router/shim', () => ({
	useRoute: () => ({ value: { params: { id: '1' } } }),
	useRouter: () => ({ push: pushMock })
}));

import HomeView from '../views/HomeView.vue';
import PokemonDetail from '../views/PokemonDetail.vue';

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe('HomeView', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		try { delete global.fetch; } catch (e) {}
	});

	it('fetches pokemons and renders pokemon boxes with images', async () => {
		global.fetch.mockImplementation((url) => {
			if (String(url).includes('?offset')) {
				return Promise.resolve({ json: () => Promise.resolve({ results: [ { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } ] }) });
			}
			if (String(url).includes('/pokemon/1')) {
				return Promise.resolve({ json: () => Promise.resolve({ sprites: { front_default: 'http://img.local/bulbasaur.png' } }) });
			}
			return Promise.reject(new Error('unexpected fetch ' + url));
		});

		const wrapper = mount(HomeView, { global: { stubs: { RouterLink: { template: '<a><slot/></a>' } } } });
		await flushPromises();
		await wrapper.vm.$nextTick();

		const imgs = wrapper.findAll('img');
		expect(imgs.length).toBeGreaterThan(0);
		expect(imgs[0].attributes('src')).toBe('http://img.local/bulbasaur.png');
		expect(global.fetch).toHaveBeenCalled();

			// También verificamos que el texto que muestra número + nombre existe
			// El componente renderiza `number + " " + name`, por lo que debería
			// aparecer algo como "1 bulbasaur" en el contenido.
			expect(wrapper.text().toLowerCase()).toContain('1 bulbasaur');
	});
});

describe('PokemonDetail', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		try { delete global.fetch; } catch (e) {}
	});

	it('loads pokemon detail, displays sprites, description and moves, and goBack works', async () => {
		// prepare mocked fetch responses
		global.fetch.mockImplementation((url) => {
			const s = String(url);
			if (s.endsWith('/pokemon/1')) {
				return Promise.resolve({ json: () => Promise.resolve({
					id: 1,
					name: 'bulbasaur',
					sprites: {
						front_default: 'http://img.local/front.png',
						back_default: 'http://img.local/back.png',
						other: { 'official-artwork': { front_default: 'http://img.local/art.png' } }
					},
					types: [{ slot: 1, type: { name: 'grass' } }],
					abilities: [{ ability: { name: 'overgrow' } }],
					stats: [{ stat: { name: 'hp' }, base_stat: 45 }],
					moves: [ { move: { name: 'tackle' } }, { move: { name: 'vine-whip' } }, { move: { name: 'razor-leaf' } } ],
					species: { url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }
				}) });
			}

			if (s.includes('/pokemon-species/1')) {
				return Promise.resolve({ json: () => Promise.resolve({ flavor_text_entries: [ { language: { name: 'es' }, flavor_text: 'Texto en español' } ] }) });
			}

			return Promise.reject(new Error('unexpected fetch ' + url));
		});

		const wrapper = mount(PokemonDetail);
		await flushPromises();
		await wrapper.vm.$nextTick();

		// Name capitalized
		expect(wrapper.text()).toContain('Bulbasaur');

		// Sprites present
		const imgs = wrapper.findAll('img');
		const srcs = imgs.map((i) => i.attributes('src'));
		expect(srcs).toEqual(expect.arrayContaining(['http://img.local/front.png', 'http://img.local/back.png', 'http://img.local/art.png']));

		// Description
		expect(wrapper.text()).toContain('Texto en español');

		// Moves list contains at least the mocked moves
		expect(wrapper.text()).toContain('tackle');

			// Verificamos que los textos clave del detalle están presentes:
			// - Tipos
			expect(wrapper.text()).toContain('grass');
			// - Habilidades
			expect(wrapper.text()).toContain('overgrow');
			// - Estadísticas base (nombre y valor)
			expect(wrapper.text()).toContain('hp');
			expect(wrapper.text()).toContain('45');
			// - Identificador (#1)
			expect(wrapper.text()).toContain('#1');

		// goBack button triggers router.push('/');
		const back = wrapper.find('button.back-button');
		await back.trigger('click');
		expect(pushMock).toHaveBeenCalledWith('/');
	});
});
