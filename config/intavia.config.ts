import { env } from "~/config/env.config";

export const baseUrl = new URL(env.NEXT_PUBLIC_API_BASE_URL);

export const defaultPageSize = 50;
