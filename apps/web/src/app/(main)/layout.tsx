import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-[100dvh] flex flex-col">
			<header className="h-12 flex items-center justify-center bg-black text-white">
				<h1 className="text-2xl font-black">Refeel Chronicle</h1>
			</header>
			<ScrollArea className="flex-1 p-2 overflow-y-auto relative">
				{children}
				<ScrollBar />
			</ScrollArea>
			<Toaster position="top-center" />
		</div>
	);
}

export default layout;
