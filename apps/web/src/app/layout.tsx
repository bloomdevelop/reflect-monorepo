import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ReactScan } from "@/components/react-scan";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Client } from "revolt.js";

export const metadata: Metadata = {
	title: "Reflect",
	description: "Revolt.js Client",
};

const geist = Geist({
	subsets: ["latin"],
});
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			{process.env.NODE_ENV === "development" && <ReactScan />}
			<body className={`${geist.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Toaster />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
