const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans]
			},
			borderRadius: {
				inherit: 'inherit'
			}
		}
	},

	plugins: [
		plugin(({ addVariant }) => {
			addVariant('hc', ['&:hover', '&:focus']);
			addVariant('group-hc', ['.group:hover &', '.group:focus &']);
			addVariant('hv', ['&:hover', '&:focus-visible']);
			addVariant('group-hv', [
				'.group:hover &',
				'.group:focus-visible &'
			]);
		})
	]
};

module.exports = config;
