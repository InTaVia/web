import type {
  BirthStatisticsSearch,
  DeathStatisticsSearch,
  EntityTypeStatisticsSearch,
  GetBiographyById,
  GetEntityById,
  GetEventById,
  GetEventKindById,
  GetMediaResourceById,
  GetOccupationById,
  GetRelationRoleById,
  OccupationStatisticsSearch,
  RetrieveBiographiesByIds,
  RetrieveEntitiesByIds,
  RetrieveEventsByIds,
  RetrieveMediaResourcesByIds,
  RetrieveOccupationsByIds,
  RetrieveRelationRolesByIds,
  SearchEntities,
  SearchEventKinds,
  SearchEvents,
  SearchOccupations,
  SearchRelationRoles,
} from '@intavia/api-client';
import {
  configureApiBaseUrl,
  getBiographyById,
  getEntityById,
  getEventById,
  getEventKindById,
  getMediaResourceById,
  getOccupationById,
  getRelationRoleById,
  retrieveBiographiesByIds,
  retrieveEntitiesByIds,
  retrieveEventKindsByIds,
  retrieveEventsByIds,
  retrieveMediaResourcesByIds,
  retrieveOccupationsByIds,
  retrieveRelationRolesByIds,
  searchBirthStatistics,
  searchDeathStatistics,
  searchEntities,
  searchEntityTypeStatistics,
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
      searchEntities: builder.query<SearchEntities.Response, SearchEntities.SearchParams>({
        query(params) {
          return {
            url: searchEntities.url(params),
            options: searchEntities.options(),
          };
        },
      }),

      getMediaResourceById: builder.query<
        GetMediaResourceById.Response,
        GetMediaResourceById.PathParams
      >({
        query(params) {
          return {
            url: getMediaResourceById.url(params),
            options: getMediaResourceById.options(),
          };
        },
      }),
      retrieveMediaResourcesByIds: builder.query<
        RetrieveMediaResourcesByIds.Response,
        {
          params: RetrieveMediaResourcesByIds.Params;
          body: RetrieveMediaResourcesByIds.RequestBody;
        }
      >({
        query(params) {
          return {
            url: retrieveMediaResourcesByIds.url(params.params),
            options: retrieveMediaResourcesByIds.options(params.body),
          };
        },
      }),

      getBiographyById: builder.query<GetBiographyById.Response, GetBiographyById.PathParams>({
        query(params) {
          return {
            url: getBiographyById.url(params),
            options: getBiographyById.options(),
          };
        },
      }),
      retrieveBiographiesByIds: builder.query<
        RetrieveBiographiesByIds.Response,
        {
          params: RetrieveBiographiesByIds.Params;
          body: RetrieveBiographiesByIds.RequestBody;
        }
      >({
        query(params) {
          return {
            url: retrieveBiographiesByIds.url(params.params),
            options: retrieveBiographiesByIds.options(params.body),
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
      searchEvents: builder.query<SearchEvents.Response, SearchEvents.SearchParams>({
        query(params) {
          return {
            url: searchEvents.url(params),
            options: searchEvents.options(),
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
      retrieveEventKindsByIds: builder.query<
        RetrieveEventsByIds.Response,
        { params: RetrieveEventsByIds.Params; body: RetrieveEventsByIds.RequestBody }
      >({
        query(params) {
          return {
            url: retrieveEventKindsByIds.url(params.params),
            options: retrieveEventKindsByIds.options(params.body),
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
      retrieveRelationRolesByIds: builder.query<
        RetrieveRelationRolesByIds.Response,
        { params: RetrieveRelationRolesByIds.Params; body: RetrieveRelationRolesByIds.RequestBody }
      >({
        query(params) {
          return {
            url: retrieveRelationRolesByIds.url(params.params),
            options: retrieveRelationRolesByIds.options(params.body),
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

      getOccupationById: builder.query<GetOccupationById.Response, GetOccupationById.PathParams>({
        query(params) {
          return {
            url: getOccupationById.url(params),
            options: getOccupationById.options(),
          };
        },
      }),
      retrieveOccupationsByIds: builder.query<
        RetrieveOccupationsByIds.Response,
        { params: RetrieveOccupationsByIds.Params; body: RetrieveOccupationsByIds.RequestBody }
      >({
        query(params) {
          return {
            url: retrieveOccupationsByIds.url(params.params),
            options: retrieveOccupationsByIds.options(params.body),
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
        OccupationStatisticsSearch.SearchParams
      >({
        query(params) {
          return {
            url: searchOccupationStatistics.url(params),
            options: searchOccupationStatistics.options(),
          };
        },
      }),
      searchEntityTypeStatistics: builder.query<
        EntityTypeStatisticsSearch.Response,
        EntityTypeStatisticsSearch.SearchParams
      >({
        query(params) {
          return {
            url: searchEntityTypeStatistics.url(params),
            options: searchEntityTypeStatistics.options(),
          };
        },
      }),
    };
  },
});

export const {
  useGetEntityByIdQuery,
  useRetrieveEntitiesByIdsQuery,
  useSearchEntitiesQuery,
  useLazySearchEntitiesQuery,

  useGetEventByIdQuery,
  useRetrieveEventsByIdsQuery,
  useSearchEventsQuery,
  useLazySearchEventsQuery,

  useGetMediaResourceByIdQuery,
  useRetrieveMediaResourcesByIdsQuery,
  useGetBiographyByIdQuery,
  useRetrieveBiographiesByIdsQuery,

  useGetEventKindByIdQuery,
  useRetrieveEventKindsByIdsQuery,
  useSearchEventKindsQuery,

  useGetRelationRoleByIdQuery,
  useRetrieveRelationRolesByIdsQuery,
  useSearchRelationRolesQuery,

  useGetOccupationByIdQuery,
  useRetrieveOccupationsByIdsQuery,
  useSearchOccupationsQuery,

  useSearchBirthStatisticsQuery,
  useSearchDeathStatisticsQuery,
  useSearchOccupationStatisticsQuery,
  useSearchEntityTypeStatisticsQuery,
} = service;
