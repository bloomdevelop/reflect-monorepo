"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { hasStoredSession } from "@/lib/auth";
import { isProtectedRoute, shouldRedirectToLogin } from "@/lib/redirect";
import { client } from "@/lib/revolt";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * AuthGuard component that protects routes and handles authentication redirects
 */
export function AuthGuard({
  children,
  fallback = null,
  requireAuth = true,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { user, isLoading, isReady } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      console.log("AuthGuard check:", {
        pathname,
        isLoading,
        isReady,
        hasUser: !!user,
        hasInitialized,
      });

      // Still loading authentication state
      if (isLoading) {
        console.log("Still loading, waiting...");
        return;
      }

      // Mark as initialized after first load completion
      if (!hasInitialized) {
        setHasInitialized(true);
      }

      // Check if this route requires authentication
      const needsAuth = requireAuth || isProtectedRoute(pathname);
      console.log("Route needs auth:", needsAuth);

      if (needsAuth) {
        // Check if we should redirect to login
        // Treat an on-disk stored session as a valid session while the client
        // is restoring so reloads don't redirect back to /login unnecessarily.
        const hasSession = !!(
          client.sessionToken ||
          user ||
          hasStoredSession()
        );
        const shouldRedirect = shouldRedirectToLogin(
          pathname,
          hasSession,
          isReady,
        );

        console.log("Should redirect to login:", shouldRedirect, {
          hasSession,
          isReady,
          pathname,
        });

        if (shouldRedirect) {
          console.log(
            `Unauthorized access to ${pathname}, redirecting to ${redirectTo}`,
          );
          router.replace(redirectTo);
          return;
        }
      }

      // If user is on login page but already authenticated, redirect to app
      if (pathname === "/login" && user && isReady) {
        console.log("Already authenticated, redirecting to app");
        router.replace("/app/home");
        return;
      }

      // All checks passed
      setIsChecking(false);
    };

    checkAuth();
  }, [
    user,
    isLoading,
    isReady,
    pathname,
    router,
    requireAuth,
    redirectTo,
    hasInitialized,
  ]);

  // Show loading state while checking authentication
  if (isLoading || (isChecking && !hasInitialized)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Restoring session..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // Show fallback if user is not authenticated and route requires auth
  const needsAuth = requireAuth || isProtectedRoute(pathname);
  // Consider a stored session on disk a valid session for redirect decisions
  const hasSession = !!(client.sessionToken || user || hasStoredSession());

  if (needsAuth && shouldRedirectToLogin(pathname, hasSession, isReady)) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access this page.
            </p>
            <button
              type="button"
              onClick={() => router.push(redirectTo)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Login
            </button>
          </div>
        </div>
      )
    );
  }

  // User is authenticated or route doesn't require auth, render children
  return <>{children}</>;
}

/**
 * Higher-order component for protecting routes
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, "children">,
) {
  const WrappedComponent = (props: P) => {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for checking authentication status in components
 */
export function useAuthGuard() {
  const { user, isLoading, isReady, logout, forceLogout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!(user && isReady);
  const needsAuth = isProtectedRoute(pathname);

  const requireAuth = () => {
    if (!isAuthenticated && needsAuth) {
      router.replace("/login");
      return false;
    }
    return true;
  };

  const handleUnauthorized = () => {
    console.log("Unauthorized action detected, logging out");
    forceLogout(true);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    needsAuth,
    requireAuth,
    handleUnauthorized,
    logout,
    forceLogout,
  };
}
