import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.GITHUB_PAGES !== 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit:{
		appDir: 'app',
		adapter: adapter({}),
		paths: {
			base: dev ? '' : '/BTD6ParagonCalculator'
		}
	}
};

export default config;