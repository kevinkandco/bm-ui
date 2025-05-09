
import React, { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import { ThemeToggle } from "./components/theme/ThemeToggle";

// Improved lazy loading with better error handling
const lazyImport = (importFn) => {
  return lazy(() => importFn().catch((error) => {
    console.error("Error loading component:", error);
    return { default: () => <div>Failed to load component</div> };
  }));
};

// Lazy load pages with optimized chunks
const Index = lazyImport(() => import("./pages/Index"));
const Onboarding = lazyImport(() => import("./pages/Onboarding"));
const Dashboard = lazyImport(() => import("./pages/Dashboard"));
const NotFound = lazyImport(() => import("./pages/NotFound"));

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 300 * 1000, // 5 minutes - improve garbage collection
    }
  }
});

// Better loading fallback with optimized re-renders
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-center">
      <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-blue-200"></div>
      <p className="text-gray-500">Loading...</p>
    </div>
  </div>
);

// Memoized loading fallback to prevent unnecessary re-renders
const MemoizedLoadingFallback = React.memo(LoadingFallback);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeToggle />
        <BrowserRouter>
          <Suspense fallback={<MemoizedLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
