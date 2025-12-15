"use client";

import type { LogEntry } from "@/hook/useClientLogger";

type Props = {
	logs: LogEntry[];
	onClear: () => void;
};

export function LoggerPanel({ logs, onClear }: Props) {
	if (logs.length === 0) return null;

	return (
		<div className="fixed bottom-2 right-2 w-[90vw] max-w-md max-h-60 bg-black/80 text-xs text-white rounded-lg shadow-lg flex flex-col z-[9999]">
			<div className="flex items-center justify-between px-2 py-1 border-b border-white/20">
				<span className="font-semibold">Client Logs</span>
				<button
					type="button"
					onClick={onClear}
					className="text-[10px] text-gray-200"
				>
					clear
				</button>
			</div>
			<div className="flex-1 overflow-auto px-2 py-1 space-y-1">
				{logs.map((log) => (
					<div key={log.id} className="flex gap-1">
						<span className="text-[10px] text-gray-300 shrink-0">
							{log.timestamp.toLocaleString()}
						</span>
						<span
							className={
								log.level === "error"
									? "text-red-300"
									: log.level === "warn"
										? "text-yellow-300"
										: "text-gray-100"
							}
						>
							{log.message}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
