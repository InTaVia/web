import type { UrlInit } from "@stefanprobst/request";
import { createUrl } from "@stefanprobst/request";

import { baseUrl } from "~/config/intavia.config";

type CreateIntaviaApiUrlArgs = Omit<UrlInit, "baseUrl">;

export function createIntaviaApiUrl(args: CreateIntaviaApiUrlArgs): URL {
	return createUrl({ ...args, baseUrl });
}
