type Primitive = boolean | number | string | null | undefined;

export type UrlSearchParamsInit = Record<string, Array<Primitive> | Primitive>;

export interface CreateUrlSearchParamsArgs {
  searchParams: UrlSearchParamsInit;
  init?: URLSearchParams;
}

export function createUrlSearchParams(args: CreateUrlSearchParamsArgs): URLSearchParams {
  const { searchParams, init } = args;

  const urlSearchParams = init ?? new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v != null) {
          urlSearchParams.append(key, String(v));
        }
      });
    } else if (value != null) {
      urlSearchParams.set(key, String(value));
    }
  });

  return urlSearchParams;
}
