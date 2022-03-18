import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Entity } from '@/features/common/entity.model';
import { createUrlSearchParams } from '@/lib/create-url-search-params';
import { baseUrl } from '~/config/intavia.config';

const service = createApi({
  reducerPath: 'intavia-api',
  baseQuery: fetchBaseQuery({
    baseUrl: String(baseUrl),
    paramsSerializer(searchParams) {
      return String(createUrlSearchParams({ searchParams }));
    },
    prepareHeaders(headers) {
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      getPersons: builder.query<{ page: number; entities: Array<Entity> }, { page?: number }>({
        query(params) {
          const { page = 1 } = params;

          return { url: '/api/persons', params: { page } };
        },
      }),
      getPlaces: builder.query<{ page: number; entities: Array<Entity> }, { page?: number }>({
        query(params) {
          const { page = 1 } = params;

          return { url: '/api/places', params: { page } };
        },
      }),
    };
  },
});

export const { useGetPersonsQuery, useGetPlacesQuery } = service;
export default service;
