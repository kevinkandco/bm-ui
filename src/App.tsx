import React, { lazy, Suspense, useState, useEffect, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedOnboardingRoute from "./components/auth/ProtectedOnboardingRoute";
import { useIsMobile } from "./hooks/use-mobile";
import { onMessageListener } from "./firebase/firebase";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
// Improved lazy loading with better error handling
const lazyImport = (importFn) => {
  return lazy(() =>
    importFn().catch((error) => {
      console.error("Error loading component:", error);
      return { default: () => <div>Failed to load component</div> };
    })
  );
};

interface NotificationPayload {
  title: string;
  body: string;
}


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
const AppLogin = lazyImport(() => import("./pages/AppLogin"));
// Admin Pages
const AdminLogin = lazyImport(() => import("./pages/admin/Login"));
const DashboardAdmin = lazyImport(() => import("./pages/admin/Dashboard"));
const UsersAdmin = lazyImport(() => import("./pages/admin/Users"));
const PlansAdmin = lazyImport(() => import("./pages/admin/Plans"));
const InvoicesAdmin = lazyImport(() => import("./pages/admin/Invoices"));

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 300 * 1000, // 5 minutes - improve garbage collection
    },
  },
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

LoadingFallback.displayName = "LoadingFallback";

// Mobile Mac Route Guard Component
const MacRouteGuard = memo(() => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <Navigate to="/dashboard" replace />;
  }

  return <MacPage />;
});

MacRouteGuard.displayName = "MacRouteGuard";

const App = () => {

  useEffect(() => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
    onMessageListener((payload: { notification: NotificationPayload }) => {
      const { title, body } = payload.notification;
      new Notification(title, {
        body,
        // icon: payload.data.icon,
        tag: `${Date.now()}`,
      });
    });
  
  }, []);


  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <div className="min-h-screen flex flex-col justify-center">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route element={<ProtectedRoute element="unprotected" />}>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                    </Route>
                    {/* PROTECTED ROUTES */}
                    <Route element={<ProtectedOnboardingRoute />}>
                      <Route path="/onboarding" element={<Onboarding />} />
                    </Route>
                    <Route element={<ProtectedRoute element="protected" />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/dashboard/briefs" element={<BriefsList />} />
                          <Route path="/dashboard/briefs/:briefId" element={<BriefDetail />} />
                      <Route path="/dashboard/tasks" element={<TasksPage />} />
                          <Route path="/dashboard/meetings" element={<MeetingsList />} />
                          <Route path="/dashboard/catch-up" element={<CatchUpPage />} />
                          <Route path="/dashboard/settings" element={<SettingsPage />} />
                    </Route>
                    {/* ADMIN ROUTES */}
                    <Route element={<AdminProtectedRoute element="unprotected" />}>
                      <Route path="/admin/login" element={<AdminLogin />} />
                    </Route>
                    <Route element={<AdminProtectedRoute element="protected" />}>
                      <Route path="/admin" element={<DashboardAdmin />} />
                        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                      <Route path="/admin/users" element={<UsersAdmin />} />
                      <Route path="/admin/plans" element={<PlansAdmin />} />
                        <Route path="/admin/invoices" element={<InvoicesAdmin />} />
                    </Route>
                    <Route path="/mac" element={<MacRouteGuard />} />
                    <Route path="/app-login-successfully" element={<AppLogin />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  )
}

export default App;
