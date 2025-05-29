import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { useApi } from "./useApi";

function useVerifyAuth() {
  const [searchParams] = useSearchParams();
  const [checked, setChecked] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const { user, logout, verify } = useAuthStore();
  const { call } = useApi();

  useEffect(() => {
    // Handle token from URL first
    const tokenFromUrl = searchParams.get("token");
    const providerFromUrl = searchParams.get("provider");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      if (providerFromUrl) {
        localStorage.setItem("provider", providerFromUrl);
      }
      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("provider");
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, [searchParams]);

  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem("token");
      
      if (!token) {
        logout();
        setChecked(true);
        return;
      }

      const response = await call("get", "/api/me", {
        showToast: false,
        returnOnFailure: false,
      });

      if (response?.data) {
        verify(response.data, true);
        setValidSession(true);

        if (response.data.is_onboard) {
          localStorage.removeItem("onboardingUserData");
          localStorage.removeItem("onboardingCurrentStep");
        }
      } else {
        logout();
      }

      setChecked(true);
    }

    // Add small delay to ensure URL token is processed
    const timer = setTimeout(verifyAuth, 50);
    return () => clearTimeout(timer);
  }, [logout, verify, searchParams, call]); // Add searchParams as dependency

  return { checked, validSession, user };
}

export default useVerifyAuth;