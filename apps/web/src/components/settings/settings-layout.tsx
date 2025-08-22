"use client";

import { ChevronRight, Download, Search, Settings, Upload } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/hooks/use-settings";
import { settingsConfig } from "@/lib/settings-config";
import { cn } from "@/lib/utils";
import { SettingsPageContent } from "./settings-page-content";

export function SettingsLayout() {
	const [activePageId, setActivePageId] = useState("account");
	const [searchQuery, setSearchQuery] = useState("");
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const { settings, updateSetting } = useSettings();

	// Generate a stable unique ID for the file input to avoid using a static literal
	const fileInputId = useMemo(
		() => `import-settings-${Math.random().toString(36).slice(2, 9)}`,
		[],
	);

	const handleExport = () => {
		toast.promise(
			new Promise((resolve) => {
				try {
					const exportData = {
						version: "1.0",
						timestamp: new Date().toISOString(),
						settings: settings,
					};

					const blob = new Blob([JSON.stringify(exportData, null, 2)], {
						type: "application/json",
					});
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = `settings-backup-${new Date().toISOString().split("T")[0]}.json`;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);

					resolve("Your settings have been exported successfully.");
				} catch {
					throw new Error("Failed to export settings. Please try again.");
				}
			}),
			{
				success: "Your settings have been exported successfully.",
				error: "Failed to export settings. Please try again.",
				loading: "Exporting settings...",
			},
		);
	};

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			toast.promise(
				new Promise((resolve, reject) => {
					try {
						const importData = JSON.parse(e.target?.result as string);

						// Validate import data structure
						if (
							!importData.settings ||
							typeof importData.settings !== "object"
						) {
							reject(new Error("Invalid settings format"));
							return;
						}

						// Validate each setting exists in current config
						const validSettings: Record<string, any> = {};
						const allSettingIds = settingsConfig.groups.flatMap((group) =>
							group.settings.map((setting) => setting.key),
						);

						Object.entries(importData.settings).forEach(([key, value]) => {
							if (allSettingIds.includes(key)) {
								validSettings[key] = value;
							}
						});

						// Apply validated settings
						Object.entries(validSettings).forEach(([key, value]) => {
							updateSetting(key, value);
						});

						resolve(true);
					} catch (error) {
						reject(error);
					}
				}),
				{
					loading: "Importing settings...",
					success: "Settings imported successfully",
					error: "Failed to import settings",
				},
			);
		};
		reader.readAsText(file);
		event.target.value = ""; // Reset input
	};

	// Fuzzy search implementation
	const searchResults = useMemo(() => {
		if (!searchQuery.trim()) return null;

		const query = searchQuery.toLowerCase();
		const results = settingsConfig.groups
			.map((group) => ({
				...group,
				settings: group.settings.filter(
					(setting) =>
						setting.label.toLowerCase().includes(query) ||
						setting.description.toLowerCase().includes(query) ||
						setting.keywords?.some((keyword) =>
							keyword.toLowerCase().includes(query),
						),
				),
			}))
			.filter((group) => group.settings.length > 0);

		return results;
	}, [searchQuery]);

	const totalMatchingSettings =
		searchResults?.reduce((acc, group) => acc + group.settings.length, 0) || 0;

	const activePage = settingsConfig.groups.find(
		(group) => group.id === activePageId,
	);

	return (
		<div className="flex w-full h-screen bg-background">
			{/* Sidebar */}
			<div
				className={cn(
					"border-r bg-muted/10 transition-all duration-300",
					sidebarCollapsed ? "w-16" : "w-80",
				)}
			>
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="p-4 border-b">
						<div className="flex items-center justify-between">
							{!sidebarCollapsed && (
								<div className="flex items-center gap-2">
									<Settings className="h-6 w-6" />
									<h1 className="text-xl font-semibold">Settings</h1>
								</div>
							)}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
								className="h-8 w-8 p-0"
							>
								<ChevronRight
									className={cn(
										"h-4 w-4 transition-transform",
										sidebarCollapsed ? "rotate-0" : "rotate-180",
									)}
								/>
							</Button>
						</div>
					</div>

					{!sidebarCollapsed && (
						<div className="p-4 border-b">
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={handleExport}
									className="flex-1 bg-transparent"
								>
									<Download className="h-4 w-4 mr-2" />
									Export
								</Button>
								<div className="flex-1">
									<input
										type="file"
										accept=".json"
										onChange={handleImport}
										className="hidden"
										id={fileInputId}
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											document.getElementById(fileInputId)?.click()
										}
										className="w-full"
									>
										<Upload className="h-4 w-4 mr-2" />
										Import
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* Search */}
					{!sidebarCollapsed && (
						<div className="p-4 border-b">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search settings..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
								{searchQuery && (
									<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
										<Badge variant="secondary" className="text-xs">
											{totalMatchingSettings}
										</Badge>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Navigation */}
					<ScrollArea className="flex-1">
						<div className="p-2">
							{searchResults ? (
								// Search Results
								<div className="space-y-1">
									{searchResults.map((group) => (
										<Button
											key={group.id}
											variant={
												activePageId === group.id ? "secondary" : "ghost"
											}
											className={cn(
												"w-full justify-start gap-3 h-auto p-3",
												sidebarCollapsed && "justify-center p-2",
											)}
											onClick={() => {
												setActivePageId(group.id);
												setSearchQuery("");
											}}
										>
											<group.icon className="h-4 w-4 shrink-0" />
											{!sidebarCollapsed && (
												<div className="flex-1 text-left">
													<div className="font-medium">{group.title}</div>
													<div className="text-xs text-muted-foreground">
														{group.settings.length} matches
													</div>
												</div>
											)}
										</Button>
									))}
								</div>
							) : (
								// Regular Navigation
								<div className="space-y-1">
									{settingsConfig.groups.map((group) => (
										<Button
											key={group.id}
											variant={
												activePageId === group.id ? "secondary" : "ghost"
											}
											className={cn(
												"w-full justify-start gap-3 h-auto p-3",
												sidebarCollapsed && "justify-center p-2",
											)}
											onClick={() => setActivePageId(group.id)}
										>
											<group.icon className="h-4 w-4 shrink-0" />
											{!sidebarCollapsed && (
												<div className="flex-1 text-left">
													<div className="font-medium">{group.title}</div>
													<div className="text-xs text-muted-foreground">
														{group.settings.length} settings
													</div>
												</div>
											)}
										</Button>
									))}
								</div>
							)}
						</div>
					</ScrollArea>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-hidden">
				{activePage && (
					<SettingsPageContent
						group={activePage}
						searchQuery={searchResults ? searchQuery : ""}
					/>
				)}
			</div>
		</div>
	);
}
