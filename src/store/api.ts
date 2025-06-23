import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "customersData",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }: { email: string, password: string }) => ({
                url: '/login',
                method: 'POST',
                body: { email, password },
                credentials: 'include',
            }),
        }),
        authenticate: builder.query({
            query: () => ({
                url: '/admin/auth/check',
                method: 'GET',
                credentials: 'include',
            }),
            // providesTags: ['User'],
            keepUnusedDataFor: 0, // immediately remove cache
        }),
        getCustomers: builder.query({
            query: ({ product_name, bias }: { product_name: string, bias: string }) => ({
                url: `/segment-by-product-and-bias?product_name=${product_name}&bias=${bias}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getCustomerById: builder.query({
            query: (uid: string) => ({
                url:`/recommend?customer_id=${uid}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getTopInsights:builder.query({
            query:()=>({
                url:'/top-insights',
                method:'GET',
                credentials: 'include',
            })
        }),
        sankeyChatData:builder.query({
            query:()=>({
                url:'/sankey-data',
                method:'GET',
                credentials: 'include',
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/admin/logout",
                method: "POST",
                credentials: 'include',
            })
        }),
    }),
})

export const { useGetCustomersQuery, useGetCustomerByIdQuery,useGetTopInsightsQuery, useAuthenticateQuery,useLoginMutation,useLogoutMutation,useSankeyChatDataQuery } = api;