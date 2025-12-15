"use client";

import { useCallback, useState } from "react";

export type LogLevel = "info" | "warn" | "error";

export type LogEntry = {
	id: number;
	level: LogLevel;
	message: string;
	timestamp: string;
};

let logId = 0;

export const useClientLogger = () => {
	const [logs, setLogs] = useState<LogEntry[]>([]);

	const log = useCallback((level: LogLevel, message: string) => {
		const now = new Date();
		setLogs((prev) => [
			{
				id: logId++,
				level,
				message,
				timestamp: now.toLocaleString(),
			},
			...prev.slice(0, 99),
		]);
	}, []);

	const clear = useCallback(() => setLogs([]), []);

	return {
		logs,
		logInfo: (msg: string) => log("info", msg),
		logWarn: (msg: string) => log("warn", msg),
		logError: (msg: string) => log("error", msg),
		clear,
	};
};
