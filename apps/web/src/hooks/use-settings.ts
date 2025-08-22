"use client";

import { useState, useEffect, useCallback } from "react";
import type { SettingValue } from "@/lib/settings-config";

const STORAGE_KEY = "app-settings";

export function useSettings() {
	const [settings, setSettings] = useState<Record<string, SettingValue>>({});
	const [isLoaded, setIsLoaded] = useState(false);

	// Load settings from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsedSettings = JSON.parse(stored);
				setSettings(parsedSettings);
			}
		} catch (error) {
			console.error("Failed to load settings from localStorage:", error);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	// Save settings to localStorage whenever they change
	const saveSettings = useCallback(
		(newSettings: Record<string, SettingValue>) => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
			} catch (error) {
				console.error("Failed to save settings to localStorage:", error);
			}
		},
		[],
	);

	// Update a single setting
	const updateSetting = useCallback(
		(key: string, value: SettingValue) => {
			setSettings((prev) => {
				const updated = { ...prev, [key]: value };
				saveSettings(updated);
				return updated;
			});
		},
		[saveSettings],
	);

	// Update multiple settings at once
	const updateSettings = useCallback(
		(updates: Record<string, SettingValue>) => {
			setSettings((prev) => {
				const updated = { ...prev, ...updates };
				saveSettings(updated);
				return updated;
			});
		},
		[saveSettings],
	);

	// Reset all settings
	const resetSettings = useCallback(() => {
		setSettings({});
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.error("Failed to clear settings from localStorage:", error);
		}
	}, []);

	// Get a specific setting with fallback to default
	const getSetting = useCallback(
		(key: string, defaultValue: SettingValue = null) => {
			return settings[key] ?? defaultValue;
		},
		[settings],
	);

	return {
		settings,
		isLoaded,
		updateSetting,
		updateSettings,
		resetSettings,
		getSetting,
	};
}
