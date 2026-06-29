import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Document, 
  Audience, 
  Page, 
  ImpactReport
} from '@kb/shared-types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 

    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001' 
  }),
  tagTypes: ['Documents', 'Audiences', 'Pages'],
  endpoints: (builder) => ({

    getDocuments: builder.query<Document[], void>({
      query: () => '/documents',
      providesTags: ['Documents'],
    }),
    createDocument: builder.mutation<Document, { name: string; type: string }>({
      query: (body) => ({
        url: '/documents',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents'],
    }),
    deleteDocument: builder.mutation<{ impacted: number }, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents', 'Audiences', 'Pages'],
    }),


    getAudiences: builder.query<Audience[], void>({
      query: () => '/audiences',
      providesTags: ['Audiences'],
    }),
    createAudience: builder.mutation<Audience, { name: string; docIds?: string[]; vpcs?: { name: string; fields: import('@kb/shared-types').VpcFields }[] }>({
      query: (body) => ({
        url: '/audiences',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Audiences'],
    }),

    getPages: builder.query<Page[], void>({
      query: () => '/pages',
      providesTags: ['Pages'],
    }),
    createPage: builder.mutation<Page, { name: string; audienceIds?: string[]; sections?: { name: string; vpcIds?: string[] }[] }>({
      query: (body) => ({
        url: '/pages',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pages'],
    }),

    getImpact: builder.query<ImpactReport, string>({
      query: (docId) => `/impact/${docId}`,
      providesTags: (_result, _error, docId) => [{ type: 'Documents', id: docId }],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useGetAudiencesQuery,
  useCreateAudienceMutation,
  useGetPagesQuery,
  useCreatePageMutation,
  useGetImpactQuery,
  useDeleteDocumentMutation,
} = api;
