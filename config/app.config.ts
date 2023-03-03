import { env } from "~/config/env.config";

export const baseUrl = new URL(env.NEXT_PUBLIC_BASE_URL);
