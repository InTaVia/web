/* eslint-disable @typescript-eslint/no-namespace */

import type { RequestOptions } from '@stefanprobst/request';
import { request } from '@stefanprobst/request';

import type {
  Entity,
  EntityEvent,
  EntityKind,
  Gender,
  Occupation,
  OccupationWithRelations,
} from '@/api/intavia.models';
import type { Bin, PaginatedRequest, PaginatedResponse, RootNode } from '@/api/intavia.types';
import { createIntaviaApiUrl } from '@/lib/create-intavia-api-url';

export namespace GetEntitiesById {
  export type SearchParams = PaginatedRequest<{
    ids: Array<Entity['id']>;
  }>;
  export type Params = SearchParams;
  export type Response = PaginatedResponse<Entity>;
}

export const getEntitiesById = {
  pathname(): string {
    return '/api/entities/id';
  },
  searchParams(params: GetEntitiesById.SearchParams): GetEntitiesById.SearchParams {
    return params;
  },
  url(params: GetEntitiesById.Params): URL {
    const url = createIntaviaApiUrl({
      pathname: getEntitiesById.pathname(),
      searchParams: getEntitiesById.searchParams(params),
    });
    return url;
  },
  options(): RequestOptions {
    return { responseType: 'json' };
  },
  request(params: GetEntitiesById.Params): Promise<GetEntitiesById.Response> {
    const url = getEntitiesById.url(params);
    const options = getEntitiesById.options();
    return request(url, options);
  },
};

//

export namespace SearchEntities {
  export type SearchParams = PaginatedRequest<{
    /**
     * Searches across labels of all entity proxies.
     */
    q?: string;
    /**
     * Limit query to specific entity types.
     */
    kind?: Array<EntityKind>;
    /**
     * Filter persons by occupation label.
     */
    occupation?: string;
    /**
     * Filter persons by occupation id (uri).
     */
    occupations_id?: Array<Occupation['id']>;
    /**
     * Filter persons by gender label.
     */
    gender?: string;
    /**
     * Filter persons by gender id (uri).
     */
    gender_id?: Gender['id']; // FIXME: should be array?
    /**
     * Filter persons born before a certain date.
     */
    bornBefore?: IsoDateString;
    /**
     * Filter persons born after a certain date.
     */
    bornAfter?: IsoDateString;
    /**
     * Filter persons died before a certain date.
     */
    diedBefore?: IsoDateString;
    /**
     * Filter persons died after a certain date.
     */
    diedAfter?: IsoDateString;
  }>;
  export type Params = SearchParams;
  export type Response = PaginatedResponse<Entity>;
}

export const searchEntities = {
  pathname(): string {
    return '/api/entities/search';
  },
  searchParams(params: SearchEntities.SearchParams): SearchEntities.SearchParams {
    return { ...params, includeEvents: 'true' };
  },
  url(params: SearchEntities.Params): URL {
    const url = createIntaviaApiUrl({
      pathname: searchEntities.pathname(),
      searchParams: searchEntities.searchParams(params),
    });
    return url;
  },
  options(): RequestOptions {
    return { responseType: 'json' };
  },
  request(params: SearchEntities.Params): Promise<SearchEntities.Response> {
    const url = searchEntities.url(params);
    const options = searchEntities.options();
    return request(url, options);
  },
};

//

export namespace SearchEvents {
  // TODO:
  export type SearchParams = PaginatedRequest<{
    q?: string;
  }>;
  export type Params = SearchParams;
  export type Response = PaginatedResponse<EntityEvent>;
}

export const searchEvents = {
  pathname(): string {
    return '/api/events/search';
  },
  searchParams(params: SearchEvents.SearchParams): SearchEvents.SearchParams {
    return params;
  },
  url(params: SearchEvents.Params): URL {
    const url = createIntaviaApiUrl({
      pathname: searchEvents.pathname(),
      searchParams: searchEvents.searchParams(params),
    });
    return url;
  },
  options(): RequestOptions {
    return { responseType: 'json' };
  },
  request(params: SearchEvents.Params): Promise<SearchEvents.Response> {
    const url = searchEvents.url(params);
    const options = searchEvents.options();
    return request(url, options);
  },
};

//

export namespace SearchOccupations {
  export type SearchParams = PaginatedRequest<{
    /**
     * Filter by label in the occupations vocabulary.
     */
    q?: string;
  }>;
  export type Params = SearchParams;
  export type Response = PaginatedResponse<OccupationWithRelations>;
}

export const searchOccupations = {
  pathname(): string {
    return '/api/vocabularies/occupations/search';
  },
  searchParams(params: SearchOccupations.SearchParams): SearchOccupations.SearchParams {
    return params;
  },
  url(params: SearchOccupations.Params): URL {
    const url = createIntaviaApiUrl({
      pathname: searchOccupations.pathname(),
      searchParams: searchOccupations.searchParams(params),
    });
    return url;
  },
  options(): RequestOptions {
    return { responseType: 'json' };
  },
  request(params: SearchOccupations.Params): Promise<SearchOccupations.Response> {
    const url = searchOccupations.url(params);
    const options = searchOccupations.options();
    return request(url, options);
  },
};

//

export namespace BirthStatisticsSearch {
  export type SearchParams = {
    /**
     * Searches across labels of all entity proxies.
     */
    q?: string;
    /**
     * Filter persons by occupation label.
     */
    occupation?: string;
    /**
     * Filter persons by occupation id (uri).
     */
    occupations_id?: Array<Occupation['id']>;
    /**
     * Filter persons by gender label.
     */
    gender?: string;
    /**
     * Filter persons by gender id (uri).
     */
    gender_id?: Gender['id']; // FIXME: should be array?
    /**
     * Filter persons born before a certain date.
     */
    bornBefore?: IsoDateString;
    /**
     * Filter persons born after a certain date.
     */
    bornAfter?: IsoDateString;
    /**
     * Filter persons died before a certain date.
     */
    diedBefore?: IsoDateString;
    /**
     * Filter persons died after a certain date.
     */
    diedAfter?: IsoDateString;
    /**
     * Into how many bins the result set should be chunked.
     *
     * @default 10
     */
    bins?: number;
  };
  export type Params = SearchParams;
  export type Response = {
    bins: Array<Bin<IsoDateString>>;
  };
}

export const searchBirthStatistics = {
  pathname(): string {
    return '/api/statistics/birth/search';
  },
  searchParams(params: BirthStatisticsSearch.SearchParams): BirthStatisticsSearch.SearchParams {
    return params;
  },
  url(params: BirthStatisticsSearch.Params): URL {
    const url = createIntaviaApiUrl({
      pathname: searchBirthStatistics.pathname(),
      searchParams: searchBirthStatistics.searchParams(params),
    });
    return url;
  },
  options(): RequestOptions {
    return { responseType: 'json' };
  },
  request(params: BirthStatisticsSearch.Params): Promise<BirthStatisticsSearch.Response> {
    const url = searchBirthStatistics.url(params);
    const options = searchBirthStatistics.options();
    return request(url, options);
  },
};

//

export namespace DeathStatisticsSearch {
  export type SearchParams = {
    /**
     * Searches across labels of all entity proxies.
     */
    q?: string;
    /**
     * Filter persons by occupation label.
     */
    occupation?: string;
    /**
     * Filter persons by occupation id (uri).
     */
    occupations_id?: Array<Occupation['id']>;
    /**
     * Filter persons by gender label.
     */
    gender?: string;
    /**
     * Filter persons by gender id (uri).
     */
    gender_id?: Gender['id']; // FIXME: should be array?
    /**
     * Filter persons born before a certain date.
     */
    bornBefore?: IsoDateString;
    /**
     * Filter persons born after a certain date.
     */
    bornAfter?: IsoDateString;
    /**
     * Filter persons died before a certain date.
     */
    diedBefore?: IsoDateString;
    /**
     * Filter persons died after a certain date.
     */
    diedAfter?: IsoDateString;
    /**
     * Into how many bins the result set should be chunked.
     *
     * @default 10
     */
    bins?: number;
  };
  export type Params = SearchParams;
  export type Response = {
    bins: Array<Bin<IsoDateString>>;
  };
}

export const searchDeathStatistics = {
  pathname(): string {
    return '/api/statistics/death/search';
  },
  searchParams(params: DeathStatisticsSearch.SearchParams): DeathStatisticsSearch.SearchParams {
    return params;
  },
  url(params: DeathStatisticsSearch.Params): URL {
    const url = createIntaviaApiUrl({
      pathname: searchDeathStatistics.pathname(),
      searchParams: searchDeathStatistics.searchParams(params),
    });
    return url;
  },
  options(): RequestOptions {
    return { responseType: 'json' };
  },
  request(params: DeathStatisticsSearch.Params): Promise<DeathStatisticsSearch.Response> {
    const url = searchDeathStatistics.url(params);
    const options = searchDeathStatistics.options();
    return request(url, options);
  },
};

//

export namespace OccupationStatisticsSearch {
  export type SearchParams = {
    /**
     * Searches across labels of all entity proxies.
     */
    q?: string;
    /**
     * Filter persons by occupation label.
     */
    occupation?: string;
    /**
     * Filter persons by occupation id (uri).
     */
    occupations_id?: Array<Occupation['id']>;
    /**
     * Filter persons by gender label.
     */
    gender?: string;
    /**
     * Filter persons by gender id (uri).
     */
    gender_id?: Gender['id']; // FIXME: should be array?
    /**
     * Filter persons born before a certain date.
     */
    bornBefore?: IsoDateString;
    /**
     * Filter persons born after a certain date.
     */
    bornAfter?: IsoDateString;
    /**
     * Filter persons died before a certain date.
     */
    diedBefore?: IsoDateString;
    /**
     * Filter persons died after a certain date.
     */
    diedAfter?: IsoDateString;
  };
  export type Params = SearchParams;
  export type Response = {
    tree: RootNode<Occupation>;
  };
}

export const searchOccupationStatistics = {
  pathname(): string {
    return '/api/statistics/occupations/search';
  },
  searchParams(
    params: OccupationStatisticsSearch.SearchParams,
  ): OccupationStatisticsSearch.SearchParams {
    return params;
  },
  url(params: OccupationStatisticsSearch.Params): URL {
    const url = createIntaviaApiUrl({
      pathname: searchOccupationStatistics.pathname(),
      searchParams: searchOccupationStatistics.searchParams(params),
    });
    return url;
  },
  options(): RequestOptions {
    return { responseType: 'json' };
  },
  request(params: OccupationStatisticsSearch.Params): Promise<OccupationStatisticsSearch.Response> {
    const url = searchOccupationStatistics.url(params);
    const options = searchOccupationStatistics.options();
    return request(url, options);
  },
};
