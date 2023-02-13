import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const story_api = createApi({
  reducerPath: 'intavia-story-api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://intavia-api.fluxguide.com/intavia/' }),
  endpoints: (build) => {
    return {
      postStory: build.mutation<unknown, unknown>({
        query: (body) => {
          return {
            url: 'post_story',
            method: 'POST',
            body,
          };
        },
      }),
    };
  },
});

export const { usePostStoryMutation } = story_api;
