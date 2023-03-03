import { log } from "@stefanprobst/log";
import { z } from "zod";

const schema = {
	server: z.object({
		BOTS: z.enum(["disabled", "enabled"]).optional(),
		BUNDLE_ANALYZER: z.enum(["disabled", "enabled"]).optional(),
		NODE_ENV: z.enum(["development", "test", "production"]),
	}),
	client: z.object({
		NEXT_PUBLIC_API_BASE_URL: z.string(),
		NEXT_PUBLIC_BASE_URL: z.string(),
	}),
};

const isServer = typeof document === "undefined";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOTS?: string | undefined;
			BUNDLE_ANALYZER?: string | undefined;
			NEXT_PUBLIC_API_BASE_URL?: string | undefined;
			NEXT_PUBLIC_BASE_URL?: string | undefined;
		}
	}
}

const processEnv: Record<
	keyof z.infer<typeof schema.server> | keyof z.infer<typeof schema.client>,
	string | undefined
> = {
	BOTS: process.env.BOTS,
	BUNDLE_ANALYZER: process.env.BUNDLE_ANALYZER,
	NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
	NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
	NODE_ENV: process.env.NODE_ENV,
};

const result = isServer
	? schema.server.merge(schema.client).safeParse(processEnv)
	: schema.client.safeParse(processEnv);

if (result.success === false) {
	const message = "Invalid environment variables";
	log.error(message + "\n", result.error.flatten().fieldErrors);
	throw new Error(message);
}

const env = result.data;

export { env };
