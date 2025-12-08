"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import useUploadFile from "@/features/file/useUploadFile";

function layout({ children }: { children: React.ReactNode }) {
    	const inputRef = useRef<HTMLInputElement | null>(null);
	const { isUploading, handleSelectFiles } = useUploadFile();

  return (
    <div>
    <div className="flex justify-center">
			<Button
				disabled={isUploading}
				onClick={(e) => {
					e.stopPropagation();
					inputRef.current?.click();
				}}
				className="h-12 rounded-full w-12 cursor-pointer absolute bottom-10 right-10"
			>
				{/* {isUploading ? <LoaderCircle className="animate-spin" /> : <Upload />} */}
				<Plus />
			</Button>

			<Input
				ref={inputRef}
				onChange={(e) => {
					const files = e.target.files;
					// TODO: filesがnullの場合エラーにする
					if (files === null) return;
					handleSelectFiles(files);
					e.currentTarget.value = "";
				}}
				type="file"
				className="hidden"
				multiple
				accept="image/*"
			/>
		</div>
        {children}
        </div>
  )
}

export default layout