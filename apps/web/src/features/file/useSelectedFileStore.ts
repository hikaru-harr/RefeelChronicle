import { create } from "zustand";
import type { FileItem } from "./useUploadFile";

type State = {
	selectedFileById: Record<string, FileItem | undefined>;
	setSelectedFile: (file: FileItem) => void;
	clearSelectedFile: (id: string) => void;
};

export const useSelectedFileStore = create<State>((set) => ({
	selectedFileById: {},
	setSelectedFile: (file) =>
		set((s) => ({
			selectedFileById: { ...s.selectedFileById, [file.id]: file },
		})),
	clearSelectedFile: (id) =>
		set((s) => {
			const next = { ...s.selectedFileById };
			delete next[id];
			return { selectedFileById: next };
		}),
}));
