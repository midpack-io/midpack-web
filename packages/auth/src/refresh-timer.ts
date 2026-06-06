import { getAccessToken } from "@midpack/api-client";
import { useAuthStore } from "./store";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes (before the 15-min expiry)

let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startSilentRefresh() {
  stopSilentRefresh();
  refreshInterval = setInterval(() => {
    if (getAccessToken()) {
      useAuthStore.getState().refreshSession();
    }
  }, REFRESH_INTERVAL_MS);
}

export function stopSilentRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}
