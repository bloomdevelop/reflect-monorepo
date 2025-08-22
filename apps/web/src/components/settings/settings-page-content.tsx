"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SettingItem } from "./setting-item";
import { AboutPage } from "./about-page";
import { useSettings } from "@/hooks/use-settings";
import type { SettingsGroup } from "@/lib/settings-config";

interface SettingsPageContentProps {
	group: SettingsGroup;
	searchQuery?: string;
}

export function SettingsPageContent({
	group,
	searchQuery,
}: SettingsPageContentProps) {
	const { settings, updateSetting } = useSettings();

	// Normalize search query to a string to avoid `string | undefined` issues
	const normalizedQuery = (searchQuery ?? "").trim();
	const q = normalizedQuery.toLowerCase();

	if (group.id === "about") {
		return (
			<ScrollArea className="h-full">
				<div className="p-6 max-w-4xl">
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-2">
							<group.icon className="h-8 w-8" />
							<h1 className="text-3xl font-bold">{group.title}</h1>
						</div>
						<p className="text-muted-foreground">{group.description}</p>
					</div>
					<AboutPage />
				</div>
			</ScrollArea>
		);
	}

	// Filter settings based on search query if provided
	const filteredSettings = normalizedQuery
		? group.settings.filter(
				(setting) =>
					setting.label.toLowerCase().includes(q) ||
					setting.description.toLowerCase().includes(q) ||
					setting.keywords?.some((keyword) =>
						keyword.toLowerCase().includes(q),
					),
			)
		: group.settings;

	return (
		<ScrollArea className="h-full">
			<div className="p-6 max-w-4xl">
				{/* Page Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<group.icon className="h-8 w-8" />
						<h1 className="text-3xl font-bold">{group.title}</h1>
					</div>
					<p className="text-muted-foreground">{group.description}</p>
					{normalizedQuery && (
						<div className="mt-2">
							<span className="text-sm text-muted-foreground">
								Showing {filteredSettings.length} of {group.settings.length}{" "}
								settings matching "{normalizedQuery}"
							</span>
						</div>
					)}
				</div>

				{/* Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<group.icon className="h-5 w-5" />
							{group.title} Settings
						</CardTitle>
						<CardDescription>
							Configure your {group.title.toLowerCase()} preferences
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{filteredSettings.map((setting, index) => (
							<div key={setting.key}>
								<SettingItem
									setting={setting}
									value={settings[setting.key] ?? setting.defaultValue}
									onChange={(value) => updateSetting(setting.key, value)}
									searchQuery={normalizedQuery}
								/>
								{index < filteredSettings.length - 1 && (
									<div className="mt-6 border-b" />
								)}
							</div>
						))}
					</CardContent>
				</Card>

				{/* Additional Info */}
				<div className="mt-8 p-4 bg-muted/50 rounded-lg">
					<h3 className="font-medium mb-2">About {group.title}</h3>
					<p className="text-sm text-muted-foreground">
						{group.description} All changes are automatically saved to your
						browser's local storage.
					</p>
				</div>
			</div>
		</ScrollArea>
	);
}
