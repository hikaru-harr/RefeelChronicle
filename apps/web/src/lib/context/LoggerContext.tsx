"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

export type LogLevel = "info" | "warn" | "error";

export type LogEntry = {
	id: number;
	level: LogLevel;
	message: string;
	timestamp: string;
};

type LoggerContextValue = {
	logs: LogEntry[];
	logInfo: (msg: string) => void;
	logWarn: (msg: string) => void;
	logError: (msg: string) => void;
	clear: () => void;
};

const LoggerContext = createContext<LoggerContextValue | null>(null);

let logId = 0;

export function LoggerProvider({ children }: { children: ReactNode }) {
	const [logs, setLogs] = useState<LogEntry[]>([]);

	const append = useCallback((level: LogLevel, message: string) => {
		const now = new Date();
		setLogs((prev) => [
			{
				id: logId++,
				level,
				message,
				timestamp: now.toLocaleTimeString(),
			},
			...prev.slice(0, 99), // 最大100件くらい
		]);
	}, []);

	const clear = useCallback(() => setLogs([]), []);

	const logInfo = useCallback((msg: string) => append("info", msg), [append]);
	const logWarn = useCallback((msg: string) => append("warn", msg), [append]);
	const logError = useCallback((msg: string) => append("error", msg), [append]);

	return (
		<LoggerContext.Provider
			value={{
				logs,
				logInfo,
				logWarn,
				logError,
				clear,
			}}
		>
			{children}
		</LoggerContext.Provider>
	);
}

export function useLogger() {
	const ctx = useContext(LoggerContext);
	if (!ctx) {
		throw new Error("useLogger must be used within <LoggerProvider>");
	}
	return ctx;
}
