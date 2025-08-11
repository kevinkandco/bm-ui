import React, { lazy, Suspense, useState, useEffect, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import { useIsMobile } from "./hooks/use-mobile";
import { attachTimeGradient } from "@/lib/timeGradient";

// Improved lazy loading with better error handling
const lazyImport = (importFn) => {
  return lazy(() => importFn().catch((error) => {
    console.error("Error loading component:", error);
    return { default: () => <div>Failed to load component</div> };
  }));
};

// Lazy load pages with optimized chunks
const Index = lazyImport(() => import("./pages/Index"));
const Login = lazyImport(() => import("./pages/Login"));
const Onboarding = lazyImport(() => import("./pages/Onboarding"));
const Dashboard = lazyImport(() => import("./pages/Dashboard"));
const BriefsList = lazyImport(() => import("./pages/BriefsList"));
const TasksPage = lazyImport(() => import("./pages/TasksPage"));
const MeetingsList = lazyImport(() => import("./pages/MeetingsList"));
const CatchUpPage = lazyImport(() => import("./pages/CatchUpPage"));
const SettingsPage = lazyImport(() => import("./pages/SettingsPage"));
const MacPage = lazyImport(() => import("./pages/MacPage"));
const BriefDetail = lazyImport(() => import("./pages/BriefDetail"));
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

// Mobile Mac Route Guard Component
const MacRouteGuard = memo(() => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <MacPage />;
});

MacRouteGuard.displayName = 'MacRouteGuard';

const App = () => {
  useEffect(() => {
    // Initialize time-of-day gradient background
    const cleanup = attachTimeGradient({
      selector: '.main-content',
      angle: '160deg',
      tickMs: 30000 // Update every 30 seconds
    });
    
    return cleanup; // Cleanup interval on unmount
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <div className="min-h-screen flex flex-col justify-center">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/briefs" element={<BriefsList />} />
                <Route path="/dashboard/briefs/:briefId" element={<BriefDetail />} />
                <Route path="/dashboard/tasks" element={<TasksPage />} />
                <Route path="/dashboard/meetings" element={<MeetingsList />} />
                <Route path="/dashboard/catch-up" element={<CatchUpPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
                <Route path="/mac" element={<MacRouteGuard />} />
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
};

export default App;
