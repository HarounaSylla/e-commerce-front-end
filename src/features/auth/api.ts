import { apiGet, apiPost } from "@/lib/api";
import type { MeResponse, SynchResponse } from "./types";

// Synchronize the user's data with the server
export function synchUser() {
  return apiPost<SynchResponse>("/auth/sync");
}

// Get the currently authenticated user's information
export function getMe() {
  return apiGet<MeResponse>("/auth/me");
}
