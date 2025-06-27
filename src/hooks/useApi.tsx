import { useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Http from "@/Http";
import { BaseURL } from "@/config";

interface ApiCallOptions {
  showToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  toastVariant?: "default" | "destructive";
  body?: unknown;
  returnOnFailure?: boolean;
  headers?: Record<string, string>;
}

export function useApi() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const call = useCallback(
    async <T = any>(
      method: "get" | "post" | "put" | "delete",
      endpoint: string,
      options: ApiCallOptions = {}
    ): Promise<T | null | false> => {
      if (!BaseURL) {
        console.error("Missing VITE_API_HOST environment variable");
        if (options.showToast) {
          toast({
            title: "Configuration Error",
            variant: "destructive",
            description: "API base URL is not configured properly.",
          });
        }
        return options.returnOnFailure === false ? false : null;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return null;
      }

      try {
        Http.setBearerToken(token);

        const response = await Http.callApi(
          method,
          `${BaseURL}${endpoint}`,
          options?.body,
          options?.headers
        );

        return response?.data ?? null;
      } catch (error: any) {
        if (error?.name === "AbortError") {
          console.log("API call aborted:", endpoint);
          return null;
        }

        console.error("API error:", error);

        if (options.showToast) {
          toast({
            title: options.toastTitle || "API Error",
            variant: options.toastVariant || "default",
            description:
              error?.response?.data?.message ||
              error?.message ||
              options.toastDescription ||
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
