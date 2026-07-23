import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { AdminBannersResponse } from "./types";

export async function getAdminBanners() {
  return apiGet<AdminBannersResponse>("/admin/settings/banners");
}

export async function uploadAdminBanners(body: FormData) {
  return apiPost<AdminBannersResponse, FormData>(
    "/admin/settings/banners",
    body
  );
}

export async function deleteAdminBanner(bannerId: string) {
  return apiDelete<AdminBannersResponse>(`/admin/settings/banners/${bannerId}`);
}
