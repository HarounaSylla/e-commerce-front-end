import axios, { type AxiosRequestConfig } from "axios";
import { env } from "./env";
import type { ApiEnvelope } from "./types";

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setApiTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: env.backendUrl,
  withCredentials: false, // include cookies in requests
});

// Add a request interceptor to include credentials (like cookies) in requests
api.interceptors.request.use(async (config) => {
  // You can add authorization headers or other custom headers here if needed
  if (!tokenGetter) {
    console.warn(
      "API token getter is not set. Requests may fail if authentication is required."
    );
    return config;
  }
  const token = await tokenGetter();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Handle Axios errors
    // Prefer the common `errors` array on the API envelope, and guard
    // all intermediate properties with optional chaining to avoid
    // "cannot read properties of undefined" runtime errors.
    return (
      error?.response?.data?.errors?.[0]?.message ||
      // some responses might nest errors under `console.errors` —
      // handle that safely as a fallback
      error?.response?.data?.console?.errors?.[0]?.message ||
      "API request failed"
    );
  }

  if (error instanceof Error) {
    // Handle general JavaScript errors
    return error.message;
  }

  // Handle other errors
  return "An unexpected error occurred";
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  try {
    const response = await api.get<ApiEnvelope<T>>(url, config);

    if (response.data.status === "error" || !response.data.data) {
      throw new Error(
        response.data.errors?.[0]?.message || "Get API returned an error"
      );
    }
    return response.data.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), { cause: err });
  }
}

export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
) {
  try {
    const response = await api.post<ApiEnvelope<TResponse>>(url, body, config);
    if (response.data.status === "error" || !response.data.data) {
      throw new Error(
        response.data.errors?.[0]?.message || "API returned an error"
      );
    }
    return response.data.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), { cause: err });
  }
}

export async function apiPut<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
) {
  try {
    const response = await api.put<ApiEnvelope<TResponse>>(url, body, config);
    if (response.data.status === "error" || !response.data.data) {
      throw new Error(
        response.data.errors?.[0]?.message || "API returned an error"
      );
    }
    return response.data.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), { cause: err });
  }
}

export async function apiPatch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
) {
  try {
    const response = await api.patch<ApiEnvelope<TResponse>>(url, body, config);

    if (response.data.status === "error" || !response.data.data) {
      throw new Error(response.data.errors?.[0]?.message || "Request failed");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
}

export async function apiDelete<TResponse>(
  url: string,
  config?: AxiosRequestConfig
) {
  try {
    const response = await api.delete<ApiEnvelope<TResponse>>(url, config);
    if (response.data.status === "error" || !response.data.data) {
      throw new Error(response.data.errors?.[0]?.message || "Request failed");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
}
