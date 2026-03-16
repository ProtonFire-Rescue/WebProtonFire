/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			spacing: {
				'13.75': '3.4375rem',
				'30': '7.5rem',
				'65': '16.25rem',
				'75': '18.75rem',
				'100': '25rem',
				'120': '30rem',
				'125': '31.25rem',
				'130': '32.5rem',
				'150': '37.5rem',
				'200': '50rem',
				'360': '90rem',
			},
			aspectRatio: {
				'3/4': '3 / 4',
			},
		},
	},
	plugins: [
		require('daisyui'),
	],
	daisyui: {
		themes: [
			{
				protonfire: {
					"primary": "#504aff",
					"primary-content": "#ffffff",
					"secondary": "#2f2f3b",
					"secondary-content": "#ffffff",
					"accent": "#37cdbe",
					"accent-content": "#ffffff",
					"neutral": "#2f2f3b",
					"neutral-content": "#ffffff",
					"base-100": "#ffffff",
					"base-200": "#f8f9fa",
					"base-300": "#e5e7eb",
					"base-content": "#2f2f3b",
					"info": "#3abff8",
					"success": "#36d399",
					"warning": "#fbbd23",
					"error": "#f87272",
				},
			},
		],
		darkTheme: false,
		base: true,
		styled: true,
		utils: true,
	},
}
