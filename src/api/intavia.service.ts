import { createApi } from '@reduxjs/toolkit/query/react';
import type { RequestOptions } from '@stefanprobst/request';
import { request } from '@stefanprobst/request';

import type {
  BirthStatisticsSearch,
  DeathStatisticsSearch,
  GetEntitiesById,
  OccupationStatisticsSearch,
  SearchEntities,
  SearchEvents,
  SearchOccupations,
} from '@/api/intavia.client';
import {
  getEntitiesById,
  searchBirthStatistics,
  searchDeathStatistics,
  searchEntities,
  searchEvents,
  searchOccupations,
  searchOccupationStatistics,
} from '@/api/intavia.client';

export const service = createApi({
  reducerPath: 'intavia-api',
  async baseQuery(args: { url: URL; options: RequestOptions }) {
    try {
      const { url, options } = args;
      const response = await request(url, options);
      return { data: response };
    } catch (error) {
      return { error };
    }
  },
  endpoints(builder) {
    return {
      getEntitiesById: builder.query<GetEntitiesById.Response, GetEntitiesById.SearchParams>({
        query(params) {
          return {
            url: getEntitiesById.url(params),
            options: getEntitiesById.options(),
          };
        },
      }),
      searchEntities: builder.query<SearchEntities.Response, SearchEntities.SearchParams>({
        query(params) {
          return {
            url: searchEntities.url(params),
            options: searchEntities.options(),
          };
        },
      }),
      searchEvents: builder.query<SearchEvents.Response, SearchEvents.SearchParams>({
        query(params) {
          return {
            url: searchEvents.url(params),
            options: searchEvents.options(),
          };
        },
      }),
      searchOccupations: builder.query<SearchOccupations.Response, SearchOccupations.SearchParams>({
        query(params) {
          return {
            url: searchOccupations.url(params),
            options: searchOccupations.options(),
          };
        },
      }),
      searchBirthStatistics: builder.query<
        BirthStatisticsSearch.Response,
        BirthStatisticsSearch.SearchParams
      >({
        query(params) {
          return {
            url: searchBirthStatistics.url(params),
            options: searchBirthStatistics.options(),
          };
        },
      }),
      searchDeathStatistics: builder.query<
        DeathStatisticsSearch.Response,
        DeathStatisticsSearch.SearchParams
      >({
        query(params) {
          return {
            url: searchDeathStatistics.url(params),
            options: searchDeathStatistics.options(),
          };
        },
      }),
      searchOccupationStatistics: builder.query<
        OccupationStatisticsSearch.Response,
        DeathStatisticsSearch.SearchParams
      >({
        query(params) {
          return {
            url: searchOccupationStatistics.url(params),
            options: searchOccupationStatistics.options(),
          };
        },
      }),
    };
  },
});

export const {
  useGetEntitiesByIdQuery,
  useSearchBirthStatisticsQuery,
  useSearchDeathStatisticsQuery,
  useSearchEntitiesQuery,
  useLazySearchEntitiesQuery,
  useSearchEventsQuery,
  useLazySearchEventsQuery,
  useSearchOccupationsQuery,
  useSearchOccupationStatisticsQuery,
} = service;
