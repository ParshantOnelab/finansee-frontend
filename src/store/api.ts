import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "customersData",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }: { email: string, password: string }) => ({
                url: '/login',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: { email, password },
            }),
        }),
        authenticate: builder.query({
            query: () => ({
                url: '/auth/check',
                method: 'GET',

            }),
            // providesTags: ['User'],
            // keepUnusedDataFor: 0, // immediately remove cache
        }),
        getCustomers: builder.query({
            query: ({ product_name, bias }: { product_name: string, bias: string }) => ({
                url: `/segment-by-product-and-bias?product_name=${product_name}&bias=${bias}`,
                method: 'GET',

            }),
        }),
        getRoles: builder.query({
            query: () => ({
                url: '/admin/get-roles',
                method: 'GET',

            })
        }),
        getDataForDifferentRoles: builder.query({
            query: (params = {}) => {
                console.log('Query Params:', params);
                const searchParams = new URLSearchParams();
                if (params.entered_role) searchParams.append('entered_role', params.entered_role);
                const queryString = searchParams.toString();
                return {
                    url: `/unified-kpi/dashboard${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            }
        }),
        getCustomerById: builder.query({
            query: (uid: string) => ({
                url: `/recommend?customer_id=${uid}`,
                method: 'GET',

            }),
        }),
        getTopInsights: builder.query({
            query: () => ({
                url: '/top-insights',
                method: 'GET',

            })
        }),
        sankeyChatData: builder.query({
            query: () => ({
                url: '/sankey-data',
                method: 'GET',

            })
        }),
        getRMRoleData: builder.query({
            query: (params: { pageIndex?: number; entered_role?: string } = {}) => {
                const searchParams = new URLSearchParams();
                if (params.pageIndex !== undefined) searchParams.append('page', String(params.pageIndex));
                if (params.entered_role) searchParams.append('entered_role', params.entered_role);
                const queryString = searchParams.toString();
                return {
                    url: `/unified-kpi/dashboard${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            }
        }),
        getDataFromAdminRole: builder.query({
            query: (role: string) => ({
                url: `/unified-kpi/kpis-admin/${role}`,
                method: 'GET',

            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/admin/logout",
                method: "POST",

            })
        }),
    }),
})

export const { useGetCustomersQuery, useGetCustomerByIdQuery, useGetTopInsightsQuery, useAuthenticateQuery, useLoginMutation, useLogoutMutation, useSankeyChatDataQuery, useGetRolesQuery, useGetDataForDifferentRolesQuery, useGetRMRoleDataQuery, useGetDataFromAdminRoleQuery } = api;