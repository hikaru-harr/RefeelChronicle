"use client";

import type { ReactNode } from "react";
import { useAuthReady } from "@/lib/auth/useAuthready";

export function AuthGate({ children }: { children: ReactNode }) {
	const ready = useAuthReady();
	if (!ready) return null;
	return <>{children}</>;
}
