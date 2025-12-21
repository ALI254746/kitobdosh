import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Books'],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 16, category = '', search = '', type = '' } = params;
        let url = `books?page=${page}&limit=${limit}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (type) url += `&type=${type}`;
        return url;
      },
      providesTags: ['Books'],
    }),
    getBookById: builder.query({
      query: (id) => `books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Books', id }],
    }),
  }),
});

export const { useGetBooksQuery, useGetBookByIdQuery } = booksApi;
