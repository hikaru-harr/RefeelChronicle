"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface FileItem {
	key: string;
	previewUrl: string;
}

function page() {
	const [files, setFiles] = useState<FileItem[]>([]);
	useEffect(() => {
		console.log("useEffect");
		const init = async () => {
			const result = await fetch("http://localhost:3000/api/files", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("jwtToken"),
				},
			});
			const data = await result.json();
			setFiles(data.files);
		};
		init();
	}, []);
	return (
		<div className="grid grid-cols-3">
			{files.map((file) => (
				<div key={file.key} className="relative aspect-square overflow-hidden">
					<Image
						src={file.previewUrl}
						alt={file.key}
						fill
						className="object-cover"
						sizes="(min-width: 768px) 33vw, 50vw"
						unoptimized
					/>
				</div>
			))}
		</div>
	);
}

export default page;
