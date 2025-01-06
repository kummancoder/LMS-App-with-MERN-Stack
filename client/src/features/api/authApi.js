import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../authSlice";

const USER_API = "http://localhost:8000/api/v1/user/";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: "include", // Automatically include cookies with requests
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body: inputData,
            }),
        }),

        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body: inputData,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log("Login API Response:", data);
                    if (data?.user) {
                        dispatch(userLoggedIn({ user: data.user }));
                    }
                } catch (error) {
                    console.error("Login API Error:", error);
                }
            },
        }),
    }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApi;
