import React from "react";

export interface ChildrenProp {
   children: Readonly<React.ReactNode>;
}

export interface ValidationError {
   [key: string]: string[];
}

export interface ApiError {
   success: boolean;
   message: string;
   status: number;
   error: ValidationError | string;
   isRefreshTokenExpired?: boolean;
}
// For mutation Error response

// For mutation response
export type ApiResponse<TResponse> = {
   message: string;
   status: number;
   data: TResponse;
};
// Primary Api props
export interface ApiProps {
   api_url: string;
   api_key: (string | number)[];
   slug?: string;
   params?: Record<string, string | number>;
}
// Primary Api props

// Primary Custom Hooks Props
export interface HookProps {
   api_url: string;
   api_key: (string | number)[];
}
// Primary Custom Hooks Props

// For Mutation Types
export interface MutationVaraibles<TPayload> {
   payload: TPayload | FormData;
   method?: "post" | "delete" | "put";
   slug?: string;
}
// For Mutation Types

// For User
export interface User {
   _id: string;
   userName: string;
   email: string;
   avatar: {
      public_id: string;
      url: string;
   };
}

export type UserResponse = {
   userName: string;
   email: string;
   avatar: string;
} | null;
