/** @typedef {import('tailwindcss').Config} TailwindConfig */

const preset = require("@intavia/ui/dist/tailwind-preset.config.cjs");

/** @type {TailwindConfig} */
const config = {
	content: ["./src/**/*.@(css|ts|tsx)", "./node_modules/@intavia/ui/dist/**/*.js"],
	preset: [preset],
	theme: {
		extend: {
			colors: {
				"intavia-brand": {
					50: "#edfbf3",
					100: "#dbf6e7",
					200: "#b9edd0",
					300: "#98e5bb",
					400: "#7adca6",
					500: "#5ed393",
					600: "#43ca81",
					700: "#2bc26f",
					800: "#15b95f",
					900: "#00b050",
				},
				"intavia-green": {
					50: "#f4fbee",
					100: "#eaf6de",
					200: "#d5eebf",
					300: "#c4e5a4",
					400: "#b4dc90",
					500: "#a8d47f",
					600: "#9dcb73",
					700: "#94c269",
					800: "#8bba61",
					900: "#84b15b",
				},
				"intavia-gray": {
					50: "#f2f2f2",
					100: "#e5e5e5",
					200: "#cbcbcb",
					300: "#b1b1b1",
					400: "#979797",
					500: "#7d7d7d",
					600: "#636363",
					700: "#494949",
					800: "#2e2e2e",
					900: "#141414",
				},
				"intavia-blue": {
					50: "#e6f5fc",
					100: "#d0edfc",
					200: "#a5dffc",
					300: "#80d2fb",
					400: "#62c8fa",
					500: "#4cbff9",
					600: "#3bb8f7",
					700: "#2fb2f4",
					800: "#28adef",
					900: "#23a8eb",
				},
				"intavia-red": {
					50: "#feebeb",
					100: "#fed7d7",
					200: "#fcb0b1",
					300: "#f88e90",
					400: "#f47375",
					500: "#ed5d60",
					600: "#e54d50",
					700: "#db4144",
					800: "#d1393c",
					900: "#c73436",
				},
				"intavia-purple": {
					50: "#f7eefe",
					100: "#efddfd",
					200: "#debcf9",
					300: "#ce9ff4",
					400: "#bf87ec",
					500: "#b073e2",
					600: "#a162d4",
					700: "#9255c4",
					800: "#844ab3",
					900: "#7741a3",
				},
			},
			fontFamily: {
				sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
			},
			screens: {
				"vq-min": [{ raw: "(max-width: 1550px)" }, { raw: "(max-height: 980px)" }],
			},
		},
	},
};

module.exports = config;
