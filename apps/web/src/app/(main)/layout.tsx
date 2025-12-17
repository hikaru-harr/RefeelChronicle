import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-[100dvh] flex flex-col">
			<header className="h-12 flex items-center justify-center bg-black text-white">
				<h1 className="text-2xl font-black">Refeel Chronicle</h1>
			</header>
			<ScrollArea className="flex-1 p-2 overflow-y-auto">{children}
				<ScrollBar />
			</ScrollArea>
		</div>
		);
	}

export default layout;
