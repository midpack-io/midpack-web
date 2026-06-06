"use client";

import { useEffect } from "react";
import { getAccessToken } from "@midpack/api-client";
import { useAuthStore } from "./store";

export function useAuth() {
  const store = useAuthStore();

  const isAuthenticated = getAccessToken() !== null;

  // Attempt session restore on mount (skip after explicit logout).
  useEffect(() => {
    if (store.isLoading) {
      try {
        if (sessionStorage.getItem("logged_out")) {
          sessionStorage.removeItem("logged_out");
          useAuthStore.setState({ user: null, isLoading: false });
          return;
        }
      } catch {
        // SSR or storage unavailable
      }
      store.refreshSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cross-tab sync: instant logout via storage event + login via visibilitychange.
  useEffect(() => {
    function handleStorageEvent(e: StorageEvent) {
      if (e.key === "logout_event" && e.newValue) {
        useAuthStore.getState().setUser(null);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState !== "visible") return;

      const hasToken = getAccessToken() !== null;
      const { user, isLoading } = useAuthStore.getState();

      if (!hasToken && user) {
        useAuthStore.getState().setUser(null);
      } else if (hasToken && !user && !isLoading) {
        useAuthStore.getState().refreshSession();
      }
    }

    window.addEventListener("storage", handleStorageEvent);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated,
    login: store.login,
    oauthLogin: store.oauthLogin,
    logout: store.logout,
    register: store.register,
  };
}
