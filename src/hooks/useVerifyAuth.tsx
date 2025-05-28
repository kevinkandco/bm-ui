import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Http from "@/Http";
import useAuthStore from "@/store/useAuthStore";

const BaseURL = import.meta.env.VITE_API_HOST;

function useVerifyAuth() {
  const [searchParams] = useSearchParams();
  const [checked, setChecked] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const { user, logout, verify } = useAuthStore();

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

      try {
        Http.setBearerToken(token);
        const response = await Http.callApi("get", `${BaseURL}/api/me`);
        if (response?.data?.data) {
          verify(response.data.data, true);
          setValidSession(true);
          if (response.data.data.is_onboard) {
            localStorage.removeItem("onboardingUserData");
            localStorage.removeItem("onboardingCurrentStep");
          }
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setChecked(true);
      }
    }

    // Add small delay to ensure URL token is processed
    const timer = setTimeout(verifyAuth, 50);
    return () => clearTimeout(timer);
  }, [logout, verify, searchParams]); // Add searchParams as dependency

  return { checked, validSession, user };
}

export default useVerifyAuth;