import type { AxiosError } from "axios";

import type { ApiError, ApiProps, ApiResponse } from "@/types/type";

import axiosInstance from "@/lib/axios";

type PostProps<TPayload> = {
   payload: TPayload | FormData;
} & ApiProps;

type UpdateProps<TPayload> = {
   payload: TPayload | FormData;
} & ApiProps;

export const handleFetch = async <TResponse>({
   api_key,
   api_url,
   slug,
   params,
}: ApiProps): Promise<ApiResponse<TResponse>> => {
   try {
      if (slug) {
         api_url += `/${slug}`;
      }

      const { data } = await axiosInstance.get<ApiResponse<TResponse>>(api_url, {
         params,
      });

      console.log(`${api_key.join()} data:`, data);

      return data;
   } catch (error) {
      console.error(`${api_key.join()} Error:`, error);

      const err = error as AxiosError<ApiError>;

      throw {
         message: err.response?.data.message,
         status: err.response?.data.status,
         error: err.response?.data.error,
         isRefreshTokenExpired: err.response?.data.isRefreshTokenExpired ?? false,
      };
   }
};

export const handlePost = async <TPayload, TResponse>({
   api_key,
   api_url,
   payload,
}: PostProps<TPayload>): Promise<ApiResponse<TResponse>> => {
   try {
      const { data } = await axiosInstance.post<ApiResponse<TResponse>>(api_url, payload);

      return data;
   } catch (error) {
      console.error(`${api_key.join()} Error:`, error);

      const err = error as AxiosError<ApiError>;

      // For validation error
      if (err.response?.data.status === 400 && err.response.data.error) {
         throw {
            success: err.response.data.success,
            message: err.response.data.message,
            status: err.response.data.status,
            error: err.response.data.error,
         };
      }
      // For validation error

      throw {
         success: err.response?.data.success,
         message: err.response?.data.message,
         status: err.response?.data.status,
         error: err.response?.data.error,
         isRefreshTokenExpired: err.response?.data.isRefreshTokenExpired ?? false,
      };
   }
};

export const handleDelete = async <TResponse>({ api_key, api_url, slug }: ApiProps) => {
   try {
      if (slug) {
         api_url += `/${slug}`;
      }
      const { data } = await axiosInstance.delete<ApiResponse<TResponse>>(api_url);

      return data;
   } catch (error) {
      console.error(`${api_key.join()} Error:`, error);

      const err = error as AxiosError<ApiError>;

      throw {
         success: err.response?.data.success,
         message: err.response?.data.message,
         status: err.response?.data.status,
         error: err.response?.data.error,
         isRefreshTokenExpired: err.response?.data.isRefreshTokenExpired ?? false,
      };
   }
};

export const handleUpdate = async <TPayload, TResponse>({
   api_key,
   api_url,
   slug,
   payload,
}: UpdateProps<TPayload>) => {
   try {
      if (slug) {
         api_url += `/${slug}`;
      }
      const { data } = await axiosInstance.patch<ApiResponse<TResponse>>(api_url, payload);

      return data;
   } catch (error) {
      console.error(`${api_key.join()} Error:`, error);

      const err = error as AxiosError<ApiError>;

      // For validation error
      if (err.response?.data.status === 400 && err.response.data.error) {
         throw {
            success: err.response.data.success,
            message: err.response.data.message,
            status: err.response.data.status,
            error: err.response.data.error,
         };
      }
      // For validation error

      throw {
         success: err.response?.data.success,
         message: err.response?.data.message,
         status: err.response?.data.status,
         error: err.response?.data.error,
         isRefreshTokenExpired: err.response?.data.isRefreshTokenExpired ?? false,
      };
   }
};
