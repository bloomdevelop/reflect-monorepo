"use client";

import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
	useTheme as useNextTheme,
} from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider {...props}>
			<ThemeSync />
			{children}
		</NextThemesProvider>
	);
}

// Component to sync theme changes between settings and next-themes
function ThemeSync() {
	const { setTheme } = useNextTheme();

	// Sync theme from settings to next-themes
	useEffect(() => {
		const theme = "system";
		if (theme) {
			setTheme(theme);
		}
	}, [setTheme]);

	return null;
}
