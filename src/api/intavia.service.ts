import type {
  BirthStatisticsSearch,
  DeathStatisticsSearch,
  GetEntityById,
  GetEventById,
  GetEventKindById,
  GetOccupationById,
  GetRelationRoleById,
  OccupationStatisticsSearch,
  RetrieveEntitiesByIds,
  RetrieveEventsByIds,
  SearchEntities,
  SearchEventKinds,
  SearchEvents,
  SearchOccupations,
  SearchRelationRoles,
} from '@intavia/api-client';
import {
  configureApiBaseUrl,
  getEntityById,
  getEventById,
  getEventKindById,
  getOccupationById,
  getRelationRoleById,
  retrieveEntitiesByIds,
  retrieveEventsByIds,
  searchBirthStatistics,
  searchDeathStatistics,
  searchEntities,
  searchEventKinds,
  searchEvents,
  searchOccupations,
  searchOccupationStatistics,
  searchRelationRoles,
} from '@intavia/api-client';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { RequestOptions } from '@stefanprobst/request';
import { request } from '@stefanprobst/request';

import { baseUrl } from '~/config/intavia.config';

configureApiBaseUrl(baseUrl);

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
      getEntityById: builder.query<GetEntityById.Response, GetEntityById.PathParams>({
        query(params) {
          return {
            url: getEntityById.url(params),
            options: getEntityById.options(),
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
      getEventById: builder.query<GetEventById.Response, GetEventById.PathParams>({
        query(params) {
          return {
            url: getEventById.url(params),
            options: getEventById.options(),
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
      searchEventKinds: builder.query<SearchEventKinds.Response, SearchEventKinds.SearchParams>({
        query(params) {
          return {
            url: searchEventKinds.url(params),
            options: searchEventKinds.options(),
          };
        },
      }),
      getEventKindById: builder.query<GetEventKindById.Response, GetEventKindById.PathParams>({
        query(params) {
          return {
            url: getEventKindById.url(params),
            options: getEventKindById.options(),
          };
        },
      }),
      searchRelationRoles: builder.query<
        SearchRelationRoles.Response,
        SearchRelationRoles.SearchParams
      >({
        query(params) {
          return {
            url: searchRelationRoles.url(params),
            options: searchRelationRoles.options(),
          };
        },
      }),
      getRelationRoleById: builder.query<
        GetRelationRoleById.Response,
        GetRelationRoleById.PathParams
      >({
        query(params) {
          return {
            url: getRelationRoleById.url(params),
            options: getRelationRoleById.options(),
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
      getOccupationById: builder.query<GetOccupationById.Response, GetOccupationById.PathParams>({
        query(params) {
          return {
            url: getOccupationById.url(params),
            options: getOccupationById.options(),
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
      retrieveEntitiesByIds: builder.query<
        RetrieveEntitiesByIds.Response,
        { params: RetrieveEntitiesByIds.Params; body: RetrieveEntitiesByIds.RequestBody }
      >({
        query(params) {
          return {
            url: retrieveEntitiesByIds.url(params.params),
            options: retrieveEntitiesByIds.options(params.body),
          };
        },
      }),
      retrieveEventsByIds: builder.query<
        RetrieveEventsByIds.Response,
        { params: RetrieveEventsByIds.Params; body: RetrieveEventsByIds.RequestBody }
      >({
        query(params) {
          return {
            url: retrieveEventsByIds.url(params.params),
            options: retrieveEventsByIds.options(params.body),
          };
        },
      }),
    };
  },
});

export const {
  useGetEntityByIdQuery,
  useSearchBirthStatisticsQuery,
  useSearchDeathStatisticsQuery,
  useSearchEntitiesQuery,
  useLazySearchEntitiesQuery,
  useSearchEventsQuery,
  useSearchEventKindsQuery,
  useLazySearchEventsQuery,
  useSearchOccupationsQuery,
  useSearchOccupationStatisticsQuery,
  useRetrieveEntitiesByIdsQuery,
  useRetrieveEventsByIdsQuery,
  useSearchRelationRolesQuery,
} = service;
