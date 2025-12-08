"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const params = useParams();
	useEffect(() => {
		console.log(params);
	}, [params]);
	return <div></div>;
}
