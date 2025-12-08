import { ScrollArea } from "@radix-ui/react-scroll-area";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<header className="h-12 flex items-center justify-center bg-black text-white">
				<h1 className="text-2xl font-black">Refeel Chronicle</h1>
			</header>
			<ScrollArea className="h-[calc(100vh-48px)] p-2">{children}</ScrollArea>
		</>
	);
}

export default layout;
