import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Http from "@/Http";
const BaseURL = import.meta.env.VITE_API_HOST;

interface ApiCallOptions {
  showToast?: boolean;
  toastTitle?: string;
  body?: any;
  toastDescription?: string;
  returnOnFailure?: boolean; // whether to return false or throw
}

export function useApi() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const call = useCallback(
    async (
      method: "get" | "post" | "put" | "delete",
      endpoint: string,
      options: ApiCallOptions = {}
    ) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return null;
        }

        Http.setBearerToken(token);

        const response = await Http.callApi(
          method,
          `${BaseURL}${endpoint}`,
          options?.body
        );

        return response?.data ?? null;
      } catch (error: any) {
        console.error("API error:", error);
        if (options?.showToast) {
          toast({
            title: options.toastTitle || "API Error",
            description:
              error?.response?.data?.message ||
              error?.message ||
              options?.toastDescription ||
              "Something went wrong.",
          });
        }
        return options.returnOnFailure === false ? false : null;
      }
    },
    [navigate, toast]
  );

  return { call };
}
