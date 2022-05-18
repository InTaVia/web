import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createUrlSearchParams } from '@stefanprobst/request';
import type { Bin } from 'd3-array';

import type { Person, Place } from '@/features/common/entity.model';
import { baseUrl } from '~/config/intavia.config';

const service = createApi({
  reducerPath: 'intavia-api',
  baseQuery: fetchBaseQuery({
    baseUrl: String(baseUrl),
    paramsSerializer(searchParams) {
      return String(createUrlSearchParams(searchParams));
    },
    prepareHeaders(headers) {
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      getPersons: builder.query<
        { page: number; pages: number; q?: string; entities: Array<Person> },
        {
          page?: number;
          q?: string;
          dateOfBirthStart?: number;
          dateOfBirthEnd?: number;
          dateOfDeathStart?: number;
          dateOfDeathEnd?: number;
        }
      >({
        query(params) {
          const {
            page = 1,
            q,
            dateOfBirthStart,
            dateOfBirthEnd,
            dateOfDeathStart,
            dateOfDeathEnd,
          } = params;

          return {
            url: '/api/persons',
            params: { page, q, dateOfBirthStart, dateOfBirthEnd, dateOfDeathStart, dateOfDeathEnd },
          };
        },
      }),
      getPersonDistributionByProperty: builder.query<
        {
          minYear: number;
          maxYear: number;
          thresholds: Array<number>;
          bins: Array<Bin<number, number>>;
        },
        { property: string }
      >({
        query(params) {
          const { property } = params;

          return { url: '/api/persons/statistics', params: { property } };
        },
      }),
      getPersonById: builder.query<Person, { id: Person['id'] }>({
        query(params) {
          const { id } = params;

          return { url: `/api/persons/${id}` };
        },
      }),
      getPlaces: builder.query<
        { page: number; pages: number; q?: string; entities: Array<Place> },
        { page?: number; q?: string }
      >({
        query(params) {
          const { page = 1, q } = params;

          return { url: '/api/places', params: { page, q } };
        },
      }),
      getPlaceById: builder.query<Place, { id: Place['id'] }>({
        query(params) {
          const { id } = params;

          return { url: `/api/places/${id}` };
        },
      }),
    };
  },
});

export const {
  useGetPersonsQuery,
  useLazyGetPersonsQuery,
  useGetPersonByIdQuery,
  useGetPlacesQuery,
  useGetPlaceByIdQuery,
  useGetPersonDistributionByPropertyQuery,
} = service;
export default service;
