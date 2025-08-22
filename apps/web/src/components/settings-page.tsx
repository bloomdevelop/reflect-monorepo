"use client";

import { useState, useMemo } from "react";
import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SettingsGroup } from "@/components/settings/settings-group";
import { useSettings } from "@/hooks/use-settings";
import { settingsConfig } from "@/lib/settings-config";

export function SettingsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeGroup, setActiveGroup] = useState<string | null>(null);
	const { settings, updateSetting } = useSettings();

	// Fuzzy search implementation
	const filteredGroups = useMemo(() => {
		if (!searchQuery.trim()) return settingsConfig.groups;

		const query = searchQuery.toLowerCase();
		return settingsConfig.groups
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
	}, [searchQuery]);

	const totalMatchingSettings = filteredGroups.reduce(
		(acc, group) => acc + group.settings.length,
		0,
	);

	return (
		<div className="container mx-auto p-6 max-w-6xl">
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<Settings className="h-8 w-8" />
					<h1 className="text-3xl font-bold">Settings</h1>
				</div>
				<p className="text-muted-foreground">
					Manage your application preferences and configuration
				</p>
			</div>

			{/* Search Bar */}
			<div className="relative mb-6">
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
							{totalMatchingSettings} found
						</Badge>
					</div>
				)}
			</div>

			{/* Settings Groups */}
			<div className="space-y-6">
				{filteredGroups.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Search className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No settings found</h3>
							<p className="text-muted-foreground text-center">
								Try adjusting your search terms or browse all settings below.
							</p>
						</CardContent>
					</Card>
				) : (
					filteredGroups.map((group) => (
						<SettingsGroup
							key={group.id}
							group={group}
							settings={settings}
							onSettingChange={updateSetting}
							isExpanded={activeGroup === group.id}
							onToggleExpanded={() =>
								setActiveGroup(activeGroup === group.id ? null : group.id)
							}
							searchQuery={searchQuery}
						/>
					))
				)}
			</div>

			{/* Quick Stats */}
			{!searchQuery && (
				<div className="mt-8 pt-6 border-t">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold">
								{settingsConfig.groups.length}
							</div>
							<div className="text-sm text-muted-foreground">Groups</div>
						</div>
						<div>
							<div className="text-2xl font-bold">
								{settingsConfig.groups.reduce(
									(acc, group) => acc + group.settings.length,
									0,
								)}
							</div>
							<div className="text-sm text-muted-foreground">Settings</div>
						</div>
						<div>
							<div className="text-2xl font-bold">
								{Object.keys(settings).length}
							</div>
							<div className="text-sm text-muted-foreground">Configured</div>
						</div>
						<div>
							<div className="text-2xl font-bold">localStorage</div>
							<div className="text-sm text-muted-foreground">Storage</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
