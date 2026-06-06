import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authApi, type User, type OAuthRequest, setAccessToken } from "@midpack/api-client";

export type OAuthProvider = "google";

interface AuthState {
  user: User | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  oauthLogin: (provider: OAuthProvider, tokenData: OAuthRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: true,

      login: async (email, password) => {
        try {
          const { data } = await authApi.login({ email, password });
          setAccessToken(data.tokens.access_token);
          try {
            sessionStorage.removeItem("logged_out");
          } catch {}
          set({ user: data.user, isLoading: false });
          return true;
        } catch {
          set({ user: null, isLoading: false });
          return false;
        }
      },

      oauthLogin: async (provider, tokenData) => {
        try {
          const { data } = await authApi.oauthAuthenticate(provider, tokenData);
          setAccessToken(data.tokens.access_token);
          try {
            sessionStorage.removeItem("logged_out");
          } catch {}
          set({ user: data.user, isLoading: false });
          return true;
        } catch (error) {
          set({ user: null, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        // Clear client state immediately so the 401 interceptor doesn't refresh
        // the token mid sign-out.
        setAccessToken(null);
        set({ user: null, isLoading: false });
        try {
          sessionStorage.setItem("logged_out", "1");
          // Notify other tabs/windows immediately.
          localStorage.setItem("logout_event", Date.now().toString());
        } catch {
          // SSR or storage unavailable
        }
        try {
          await authApi.logout();
        } catch {
          // Best-effort — client state is already cleared.
        }
      },

      register: async (email, password, name) => {
        try {
          const { data } = await authApi.register({ email, password, ...(name && { name }) });
          setAccessToken(data.tokens.access_token);
          try {
            sessionStorage.removeItem("logged_out");
          } catch {}
          set({ user: data.user, isLoading: false });
          return true;
        } catch (error) {
          set({ user: null, isLoading: false });
          throw error;
        }
      },

      refreshSession: async () => {
        set({ isLoading: true });
        try {
          // 1. GET /me — the client interceptor handles 401→refresh automatically.
          const { data: user } = await authApi.me();
          set({ user, isLoading: false });
          return true;
        } catch {
          // 2. /me failed — try an explicit refresh (the httpOnly cookie may exist).
          try {
            const { data } = await authApi.refresh();
            setAccessToken(data.tokens.access_token);
            const { data: user } = await authApi.me();
            set({ user, isLoading: false });
            return true;
          } catch {
            setAccessToken(null);
            set({ user: null, isLoading: false });
            return false;
          }
        }
      },

      setUser: (user) => set({ user }),
    }),
    { name: "AuthStore" },
  ),
);
