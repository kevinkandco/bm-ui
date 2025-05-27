
import React, { lazy, Suspense, useState, useEffect, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedOnboardingRoute from "./components/auth/ProtectedOnboardingRoute";

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
const BriefsList = lazyImport(() => import("./pages/BriefsList"));
const TasksList = lazyImport(() => import("./pages/TasksList"));
const MeetingsList = lazyImport(() => import("./pages/MeetingsList"));
const CatchUpPage = lazyImport(() => import("./pages/CatchUpPage"));
const SettingsPage = lazyImport(() => import("./pages/SettingsPage"));
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
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-center">
      <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-blue-200"></div>
      <p className="text-gray-500">Loading...</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <div className="min-h-screen flex flex-col justify-center">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route element={<ProtectedRoute element="unprotected" />}>
                  <Route path="/" element={<Index />} />
                </Route>
                <Route element={<ProtectedOnboardingRoute />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                </Route>
                <Route element={<ProtectedRoute element="protected" />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/dashboard/briefs" element={<BriefsList />} />
                      <Route path="/dashboard/tasks" element={<TasksList />} />
                      <Route path="/dashboard/meetings" element={<MeetingsList />} />
                      <Route path="/dashboard/catch-up" element={<CatchUpPage />} />
                      <Route path="/dashboard/settings" element={<SettingsPage />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
