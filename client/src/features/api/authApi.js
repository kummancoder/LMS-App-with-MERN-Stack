import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

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
          const result = await queryFulfilled;
          // console.log("Login API Response:", result.data.data);
          if (result?.data) {
            dispatch(userLoggedIn({ user: result.data }));
          }
        } catch (error) {
          console.error("Login API Error:", error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "getCurrentUser",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // console.log("Load API Response:", result.data.data);
          if (result?.data) {
            dispatch(userLoggedIn({ user: result.data }));
          }
        } catch (error) {
          console.error("Load API Error:", error);
        }
      },
    }),
    updateUserProfile: builder.mutation({
      query: (inputData) => ({
        url: "updateUserProfile",
        method: "PUT",
        body: inputData,
        credentials: "include",
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.error("Load API Error:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateUserProfileMutation,
  useLogoutUserMutation,
} = authApi;
