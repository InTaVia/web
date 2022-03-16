import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Entity } from '@/features/common/entity.model';
import { baseUrl } from '~/config/intavia.config';

const service = createApi({
  reducerPath: 'intavia-api',
  baseQuery: fetchBaseQuery({
    baseUrl: String(baseUrl),
    prepareHeaders(headers) {
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      getPersons: builder.query<Array<Entity>, { page?: number }>({
        query(params) {
          const { page = 1 } = params;

          const searchParams = new URLSearchParams();
          searchParams.set('page', String(page));

          return [`/api/persons`, String(searchParams)].join('?');
        },
      }),
      getPlaces: builder.query<Array<Entity>, { page?: number }>({
        query(params) {
          const { page = 1 } = params;

          const searchParams = new URLSearchParams();
          searchParams.set('page', String(page));

          return [`/api/places`, String(searchParams)].join('?');
        },
      }),
    };
  },
});

export const { useGetPersonsQuery, useGetPlacesQuery } = service;
export default service;
