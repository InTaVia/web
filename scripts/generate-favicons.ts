import { copyFile } from "node:fs/promises";
import { extname, join } from "node:path";

import generateFavicons, { generateSocialImage } from "@stefanprobst/favicons";
import { log } from "@stefanprobst/log";

import { createAssetLink } from "@/lib/create-asset-link";
import { manifestFileName, metadata, openGraphImageName } from "~/config/metadata.config";

async function generate(): Promise<void> {
	const publicFolder = join(process.cwd(), "public");

	await Promise.all(
		Object.values(metadata).map(async (config) => {
			const inputFilePath = join(process.cwd(), config.logo.path);
			const outputFolder = join(publicFolder, createAssetLink({ locale: config.locale }));

			await generateFavicons({
				inputFilePath,
				manifestFileName,
				maskable: config.logo.maskable,
				name: config.title,
				outputFolder,
				shortName: config.shortTitle,
			});

			if (extname(inputFilePath) === ".svg") {
				await copyFile(inputFilePath, join(outputFolder, "icon.svg"));
			}

			await generateSocialImage(
				join(process.cwd(), config.image.path),
				join(outputFolder, openGraphImageName),
				{ fit: config.image.fit },
			);
		}),
	);
}

generate()
	.then(() => {
		log.success("Successfully generated favicons.");
	})
	.catch((error) => {
		log.error("Failed to generate favicons.\n", String(error));
		process.exit(1);
	});
