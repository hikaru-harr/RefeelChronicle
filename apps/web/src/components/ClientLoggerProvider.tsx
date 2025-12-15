"use client";

import { LoggerPanel } from "@/components/LoggerPanel";
import { LoggerProvider, useLogger } from "@/lib/context/LoggerContext";

function LoggerPanelContainer() {
	const { logs, clear } = useLogger();
	return <LoggerPanel logs={logs} onClear={clear} />;
}

export function ClientLoggerRoot({ children }: { children: React.ReactNode }) {
	return (
		<LoggerProvider>
			{children}
			<LoggerPanelContainer />
		</LoggerProvider>
	);
}
