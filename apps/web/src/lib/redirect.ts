"use client";

import { useRouter } from "next/navigation";

/**
 * Redirect utilities for authentication flows
 */

/**
 * Redirect to login page
 */
export function redirectToLogin(): void {
	if (typeof window !== "undefined") {
		// Use window.location for immediate redirect
		window.location.href = "/login";
	}
}

/**
 * Redirect to home page
 */
export function redirectToHome(): void {
	if (typeof window !== "undefined") {
		window.location.href = "/app/home";
	}
}

/**
 * Redirect with Next.js router (for client-side navigation)
 */
export function useAuthRedirect() {
	const router = useRouter();

	const redirectToLogin = () => {
		router.replace("/login");
	};

	const redirectToHome = () => {
		router.replace("/app/home");
	};

	const redirectToPath = (path: string) => {
		router.replace(path);
	};

	return {
		redirectToLogin,
		redirectToHome,
		redirectToPath,
	};
}

/**
 * Check if current path requires authentication
 */
export function isProtectedRoute(path: string): boolean {
	const protectedPaths = ["/app", "/settings", "/profile"];

	return protectedPaths.some((protectedPath) => path.startsWith(protectedPath));
}

/**
 * Check if user should be redirected to login
 */
export function shouldRedirectToLogin(
	path: string,
	hasSession: boolean,
	isReady: boolean,
): boolean {
	// Don't redirect if already on login page
	if (path === "/login" || path === "/") {
		return false;
	}

	// Don't redirect if on public routes
	if (!isProtectedRoute(path)) {
		return false;
	}

	// Don't redirect if we have a session and are still connecting/loading
	if (hasSession && !isReady) {
		return false;
	}

	// Redirect if no session or ready but no user
	return !hasSession || !isReady;
}

/**
 * Get redirect path after login
 */
export function getRedirectPath(): string {
	if (typeof window !== "undefined") {
		const currentPath = window.location.pathname;
		const savedPath = getSavedRedirectPath();

		// Use saved path if available and valid
		if (savedPath && isProtectedRoute(savedPath)) {
			clearSavedRedirectPath();
			return savedPath;
		}

		// If user was on login page, redirect to home
		if (currentPath === "/login" || currentPath === "/") {
			return "/app/home";
		}

		// If user was on a protected route, redirect there after login
		if (isProtectedRoute(currentPath)) {
			return currentPath;
		}

		// Default to home
		return "/app/home";
	}

	return "/app/home";
}

/**
 * Save redirect path before logout (for potential restoration)
 */
export function saveRedirectPath(): void {
	if (typeof window !== "undefined") {
		const currentPath = window.location.pathname;
		if (isProtectedRoute(currentPath) && currentPath !== "/login") {
			sessionStorage.setItem("pre-logout-path", currentPath);
		}
	}
}

/**
 * Get saved redirect path
 */
export function getSavedRedirectPath(): string | null {
	if (typeof window !== "undefined") {
		return sessionStorage.getItem("pre-logout-path");
	}
	return null;
}

/**
 * Clear saved redirect path
 */
export function clearSavedRedirectPath(): void {
	if (typeof window !== "undefined") {
		sessionStorage.removeItem("pre-logout-path");
	}
}
