"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SettingItem } from "./setting-item";
import type {
	SettingsGroup as SettingsGroupType,
	SettingValue,
} from "@/lib/settings-config";

interface SettingsGroupProps {
	group: SettingsGroupType;
	settings: Record<string, SettingValue>;
	onSettingChangeAction: (key: string, value: SettingValue) => void;
	isExpanded: boolean;
	onToggleExpandedAction: () => void;
	searchQuery: string;
}

export function SettingsGroup({
	group,
	settings,
	onSettingChangeAction,
	isExpanded,
	onToggleExpandedAction,
	searchQuery,
}: SettingsGroupProps) {
	const Icon = group.icon;

	return (
		<Card className="flex flex-col w-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Icon className="h-5 w-5 text-primary" />
						<div>
							<CardTitle className="text-lg">{group.title}</CardTitle>
							<CardDescription>{group.description}</CardDescription>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="text-xs">
							{group.settings.length} settings
						</Badge>
						<Button
							variant="ghost"
							size="sm"
							onClick={onToggleExpandedAction}
							className="h-8 w-8 p-0"
						>
							{isExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			</CardHeader>

			{isExpanded && (
				<CardContent className="pt-0">
					<div className="space-y-4">
						{group.settings.map((setting) => (
							<SettingItem
								key={setting.key}
								setting={setting}
								value={settings[setting.key] ?? setting.defaultValue}
								onChange={(value) => onSettingChangeAction(setting.key, value)}
								searchQuery={searchQuery}
							/>
						))}
					</div>
				</CardContent>
			)}
		</Card>
	);
}
