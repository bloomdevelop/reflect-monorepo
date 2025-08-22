"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { Setting, SettingValue } from "@/lib/settings-config";

interface SettingItemProps {
	setting: Setting;
	value: SettingValue;
	onChange: (value: SettingValue) => void;
	searchQuery: string;
}

export function SettingItem(props: SettingItemProps) {
	const { setting, value, onChange: onChangeAction, searchQuery } = props;

	const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	const highlightText = (text: string, query: string) => {
		if (!query.trim()) return text;

		const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
		const parts = text.split(regex);

		return parts.map((part, index) =>
			index % 2 === 1 ? (
				<mark
					key={`${text}-${index}-${part}`}
					className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
				>
					{part}
				</mark>
			) : (
				part
			),
		);
	};

	const renderControl = () => {
		switch (setting.type) {
			case "boolean":
				return (
					<Switch
						checked={value as boolean}
						onCheckedChange={onChangeAction}
						disabled={setting.disabled}
					/>
				);

			case "string": {
				const stringValue = value as string;
				const maxLength = setting.maxLength;
				const currentLength = stringValue?.length || 0;
				const isNearLimit = maxLength && currentLength >= maxLength * 0.8;
				const isOverLimit = maxLength && currentLength > maxLength;

				return (
					<div className="space-y-1">
						<Input
							value={stringValue}
							onChange={(e) => onChangeAction(e.target.value)}
							placeholder={setting.placeholder}
							disabled={setting.disabled}
							className="max-w-xs"
							maxLength={maxLength}
						/>
						{maxLength && (
							<div
								className={`text-xs ${
									isOverLimit
										? "text-red-500"
										: isNearLimit
											? "text-orange-500"
											: "text-muted-foreground"
								}`}
							>
								{currentLength}/{maxLength} characters
							</div>
						)}
					</div>
				);
			}

			case "number":
				return (
					<Input
						type="number"
						value={value as number}
						onChange={(e) => onChangeAction(Number(e.target.value))}
						min={setting.min}
						max={setting.max}
						disabled={setting.disabled}
						className="max-w-xs"
					/>
				);

			case "select":
				return (
					<Select
						value={value as string}
						onValueChange={onChangeAction}
						disabled={setting.disabled}
					>
						<SelectTrigger className="max-w-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{setting.options?.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);

			case "range":
				return (
					<div className="flex items-center gap-4 max-w-xs">
						<Slider
							value={[value as number]}
							onValueChange={([newValue]) => onChangeAction(newValue)}
							min={setting.min}
							max={setting.max}
							step={setting.step}
							disabled={setting.disabled}
							className="flex-1"
						/>
						<Badge variant="outline" className="min-w-12 text-center">
							{value}
						</Badge>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="flex items-center justify-between py-3 border-border last:border-0 border-b-0">
			<div className="flex-1 space-y-1">
				<Label className="text-sm font-medium">
					{highlightText(setting.label, searchQuery)}
				</Label>
				<p className="text-sm text-muted-foreground">
					{highlightText(setting.description, searchQuery)}
				</p>
				{setting.warning && (
					<p className="text-xs text-orange-600 dark:text-orange-400">
						⚠️ {setting.warning}
					</p>
				)}
			</div>
			<div className="ml-4 flex flex-col items-end">{renderControl()}</div>
		</div>
	);
}
