"use client";

import {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";

interface LogContextType {
	logs: string[];
	addLog: (message: string) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

function getTimestamp() {
	return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export function LogProvider({ children }: { children: React.ReactNode }) {
	const [logs, setLogs] = useState<string[]>([
		`[${getTimestamp()}] App started.`,
	]);
	const logId = useRef(1);

	const addLog = useCallback((message: string) => {
		setLogs((prev) => [`[${getTimestamp()}] ${message}`, ...prev]);
		logId.current++;
	}, []);

	return (
		<LogContext.Provider value={{ logs, addLog }}>
			{children}
		</LogContext.Provider>
	);
}

export function useLog() {
	const ctx = useContext(LogContext);
	if (!ctx) throw new Error("useLog must be used within a LogProvider");
	return ctx;
}
