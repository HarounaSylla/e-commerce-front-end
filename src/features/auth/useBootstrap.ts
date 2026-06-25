import { useAuth } from "@clerk/react";
import { useAuthStore } from "./store";
import { useEffect } from "react";
import { getMe, synchUser } from "./api";
import { setApiTokenGetter } from "@/lib/api";

export function useBootstrapAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { setLoading, setUser, clearAuth, setError } = useAuthStore();

  useEffect(() => {
    setApiTokenGetter(async () => {
      const token = await getToken();
      return token || null;
    });
  }, [getToken]);

  useEffect(() => {
    async function run() {
      if (!isLoaded) return;
      if (!isSignedIn) {
        clearAuth();
        return;
      }

      try {
        setLoading();
        await synchUser();
        const me = await getMe();
        setUser(me?.user);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load user data";
        setError(message);
      }
    }
    void run();
  }, [isLoaded, isSignedIn, clearAuth, setError, setLoading, setUser]);
}
