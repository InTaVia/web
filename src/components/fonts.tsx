import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({
	axes: ["slnt"],
	display: "swap",
	subsets: ["latin"],
	variable: "--font-sans",
});

export function Fonts(): JSX.Element {
	return (
		<Head>
			{/* @see https://github.com/vercel/next.js/issues/43674 */}
			{/* eslint-disable-next-line react/no-unknown-property */}
			<style jsx global>{`
				:root {
					--font-sans: ${inter.style.fontFamily};
				}
			`}</style>
		</Head>
	);
}
