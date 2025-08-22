import { User, Bell, Shield, Palette, Monitor, Zap, Info } from "lucide-react";

export type SettingValue = string | number | boolean | null;

export interface SettingOption {
	label: string;
	value: string;
}

export interface Setting {
	key: string;
	label: string;
	description: string;
	type: "boolean" | "string" | "number" | "select" | "range";
	defaultValue: SettingValue;
	options?: SettingOption[];
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
	disabled?: boolean;
	warning?: string;
	keywords?: string[];
	maxLength?: number;
}

export interface SettingsGroup {
	id: string;
	title: string;
	description: string;
	icon: any;
	settings: Setting[];
}

export const settingsConfig = {
	groups: [
		{
			id: "account",
			title: "Account & Profile",
			description: "Manage your personal information and account preferences",
			icon: User,
			settings: [
				{
					key: "profile_public",
					label: "Public Profile",
					description: "Make your profile visible to other users",
					type: "boolean" as const,
					defaultValue: false,
					keywords: ["public", "visible", "privacy"],
				},
				{
					key: "display_name",
					label: "Display Name",
					description: "The name shown to other users",
					type: "string" as const,
					defaultValue: "",
					placeholder: "Enter your display name",
					maxLength: 50,
					keywords: ["name", "username", "identity"],
				},
				{
					key: "bio_length",
					label: "Bio Character Limit",
					description: "Maximum characters allowed in your bio",
					type: "range" as const,
					defaultValue: 160,
					min: 50,
					max: 500,
					step: 10,
					keywords: ["bio", "description", "limit"],
				},
			],
		},
		{
			id: "notifications",
			title: "Notifications",
			description: "Control how and when you receive notifications",
			icon: Bell,
			settings: [
				{
					key: "email_notifications",
					label: "Email Notifications",
					description: "Receive notifications via email",
					type: "boolean" as const,
					defaultValue: true,
					keywords: ["email", "alerts", "messages"],
				},
				{
					key: "push_notifications",
					label: "Push Notifications",
					description: "Receive push notifications in your browser",
					type: "boolean" as const,
					defaultValue: false,
					keywords: ["push", "browser", "alerts"],
				},
				{
					key: "notification_frequency",
					label: "Notification Frequency",
					description: "How often to receive notification summaries",
					type: "select" as const,
					defaultValue: "daily",
					options: [
						{ label: "Immediately", value: "immediate" },
						{ label: "Hourly", value: "hourly" },
						{ label: "Daily", value: "daily" },
						{ label: "Weekly", value: "weekly" },
						{ label: "Never", value: "never" },
					],
					keywords: ["frequency", "timing", "schedule"],
				},
				{
					key: "quiet_hours_start",
					label: "Quiet Hours Start",
					description: "Hour when notifications should be muted (24h format)",
					type: "number" as const,
					defaultValue: 22,
					min: 0,
					max: 23,
					keywords: ["quiet", "mute", "sleep", "hours"],
				},
			],
		},
		{
			id: "privacy",
			title: "Privacy & Security",
			description: "Manage your privacy settings and security preferences",
			icon: Shield,
			settings: [
				{
					key: "two_factor_auth",
					label: "Two-Factor Authentication",
					description: "Add an extra layer of security to your account",
					type: "boolean" as const,
					defaultValue: false,
					keywords: ["2fa", "security", "authentication", "protection"],
				},
				{
					key: "data_collection",
					label: "Analytics Data Collection",
					description: "Allow collection of anonymous usage data",
					type: "boolean" as const,
					defaultValue: true,
					keywords: ["analytics", "tracking", "data", "privacy"],
				},
				{
					key: "session_timeout",
					label: "Session Timeout (minutes)",
					description: "Automatically log out after period of inactivity",
					type: "select" as const,
					defaultValue: "60",
					options: [
						{ label: "15 minutes", value: "15" },
						{ label: "30 minutes", value: "30" },
						{ label: "1 hour", value: "60" },
						{ label: "4 hours", value: "240" },
						{ label: "Never", value: "0" },
					],
					keywords: ["session", "timeout", "logout", "security"],
				},
			],
		},
		{
			id: "appearance",
			title: "Appearance",
			description: "Customize the look and feel of the application",
			icon: Palette,
			settings: [
				{
					key: "theme",
					label: "Theme",
					description: "Choose your preferred color scheme",
					type: "select" as const,
					defaultValue: "system",
					options: [
						{ label: "Light", value: "light" },
						{ label: "Dark", value: "dark" },
						{ label: "System", value: "system" },
					],
					keywords: ["theme", "dark", "light", "colors"],
				},
				{
					key: "compact_mode",
					label: "Compact Mode",
					description: "Use a more compact layout to fit more content",
					type: "boolean" as const,
					defaultValue: false,
					keywords: ["compact", "dense", "layout", "spacing"],
				},
				{
					key: "font_size",
					label: "Font Size",
					description: "Adjust the base font size for better readability",
					type: "range" as const,
					defaultValue: 14,
					min: 12,
					max: 18,
					step: 1,
					keywords: ["font", "text", "size", "readability"],
				},
				{
					key: "message_design",
					label: "Message Design",
					description:
						"Choose how messages are displayed: 'Normal' for the classic layout, 'Bubble' for chat bubble style with alternative alignment and reaction placement.",
					type: "select" as const,
					defaultValue: "normal",
					options: [
						{ label: "Normal (Default)", value: "normal" },
						{ label: "Bubble", value: "bubble" },
					],
					keywords: ["message", "design", "layout", "bubble"],
				},
				{
					key: "animations",
					label: "Enable Animations",
					description: "Show smooth transitions and animations",
					type: "boolean" as const,
					defaultValue: true,
					keywords: ["animations", "transitions", "motion", "effects"],
				},
			],
		},
		{
			id: "performance",
			title: "Performance",
			description: "Optimize application performance and resource usage",
			icon: Zap,
			settings: [
				{
					key: "auto_save",
					label: "Auto-save",
					description: "Automatically save changes as you work",
					type: "boolean" as const,
					defaultValue: true,
					keywords: ["autosave", "save", "backup", "automatic"],
				},
				{
					key: "cache_size",
					label: "Cache Size (MB)",
					description: "Amount of data to cache for faster loading",
					type: "range" as const,
					defaultValue: 100,
					min: 50,
					max: 500,
					step: 25,
					keywords: ["cache", "storage", "performance", "speed"],
				},
				{
					key: "preload_content",
					label: "Preload Content",
					description: "Load content in advance for smoother experience",
					type: "boolean" as const,
					defaultValue: true,
					warning: "May increase data usage",
					keywords: ["preload", "prefetch", "loading", "data"],
				},
			],
		},
		{
			id: "advanced",
			title: "Advanced",
			description: "Advanced settings for power users",
			icon: Monitor,
			settings: [
				{
					key: "debug_mode",
					label: "Debug Mode",
					description: "Enable debug logging and developer tools",
					type: "boolean" as const,
					defaultValue: false,
					warning: "Only enable if you know what you're doing",
					keywords: ["debug", "developer", "logging", "console"],
				},
				{
					key: "api_timeout",
					label: "API Timeout (seconds)",
					description: "How long to wait for API responses",
					type: "number" as const,
					defaultValue: 30,
					min: 5,
					max: 120,
					keywords: ["api", "timeout", "network", "requests"],
				},
				{
					key: "experimental_features",
					label: "Experimental Features",
					description: "Enable experimental and beta features",
					type: "boolean" as const,
					defaultValue: false,
					warning: "Experimental features may be unstable",
					keywords: ["experimental", "beta", "features", "testing"],
				},
			],
		},
		{
			id: "integrations",
			title: "Integrations",
			description: "Connect and manage third-party services and APIs",
			icon: Monitor,
			settings: [
				{
					key: "webhook_url",
					label: "Webhook URL",
					description: "URL to receive webhook notifications",
					type: "string" as const,
					defaultValue: "",
					placeholder: "https://your-app.com/webhook",
					maxLength: 200,
					keywords: ["webhook", "api", "notifications", "url"],
				},
				{
					key: "api_rate_limit",
					label: "API Rate Limit (requests/minute)",
					description: "Maximum API requests per minute",
					type: "range" as const,
					defaultValue: 60,
					min: 10,
					max: 1000,
					step: 10,
					keywords: ["api", "rate", "limit", "throttle"],
				},
				{
					key: "sync_enabled",
					label: "Data Synchronization",
					description: "Enable automatic data sync with external services",
					type: "boolean" as const,
					defaultValue: true,
					keywords: ["sync", "synchronization", "data", "external"],
				},
			],
		},
		{
			id: "accessibility",
			title: "Accessibility",
			description: "Improve accessibility and usability for all users",
			icon: User,
			settings: [
				{
					key: "high_contrast",
					label: "High Contrast Mode",
					description: "Increase contrast for better visibility",
					type: "boolean" as const,
					defaultValue: false,
					keywords: ["contrast", "visibility", "accessibility", "vision"],
				},
				{
					key: "reduce_motion",
					label: "Reduce Motion",
					description: "Minimize animations and transitions",
					type: "boolean" as const,
					defaultValue: false,
					keywords: ["motion", "animations", "accessibility", "vestibular"],
				},
				{
					key: "screen_reader",
					label: "Screen Reader Support",
					description: "Enhanced support for screen readers",
					type: "boolean" as const,
					defaultValue: true,
					keywords: ["screen reader", "aria", "accessibility", "blind"],
				},
				{
					key: "keyboard_navigation",
					label: "Enhanced Keyboard Navigation",
					description: "Improved keyboard shortcuts and navigation",
					type: "boolean" as const,
					defaultValue: true,
					keywords: ["keyboard", "navigation", "shortcuts", "accessibility"],
				},
			],
		},
		{
			id: "backup",
			title: "Backup & Export",
			description: "Manage data backup, export, and recovery options",
			icon: Shield,
			settings: [
				{
					key: "auto_backup",
					label: "Automatic Backup",
					description: "Automatically backup your data",
					type: "boolean" as const,
					defaultValue: true,
					keywords: ["backup", "automatic", "data", "recovery"],
				},
				{
					key: "backup_frequency",
					label: "Backup Frequency",
					description: "How often to create automatic backups",
					type: "select" as const,
					defaultValue: "daily",
					options: [
						{ label: "Every hour", value: "hourly" },
						{ label: "Daily", value: "daily" },
						{ label: "Weekly", value: "weekly" },
						{ label: "Monthly", value: "monthly" },
					],
					keywords: ["backup", "frequency", "schedule", "timing"],
				},
				{
					key: "export_format",
					label: "Export Format",
					description: "Default format for data exports",
					type: "select" as const,
					defaultValue: "json",
					options: [
						{ label: "JSON", value: "json" },
						{ label: "CSV", value: "csv" },
						{ label: "XML", value: "xml" },
						{ label: "PDF", value: "pdf" },
					],
					keywords: ["export", "format", "data", "download"],
				},
			],
		},
		{
			id: "about",
			title: "About",
			description: "Information about this application and its features",
			icon: Info,
			settings: [], // About page doesn't use traditional settings
		},
	],
};
