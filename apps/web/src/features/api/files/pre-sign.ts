import { api } from "@/lib/api";

export const getPreSignedUrl = async (
		file: File,
	): Promise<{ preSignedUrl: string; objectKey: string } | null> => {
		console.log(
			`getPreSignedUrl start ${process.env.NEXT_PUBLIC_API_TARGET}/api/files/pre-sign`,
		);

		try {
			const url = await api.post(
				`/api/files/pre-sign`,
				{
					fileName: file.name,
					fileType: file.type,
				},
			);
			console.log(
				`getPreSignedUrl success ${process.env.NEXT_PUBLIC_API_TARGET}/api/files/pre-sign`,
			);
			return url.data;
		} catch (error) {
			console.error(`getPreSignedUrl error: ${error}`);
			return null;
		}
	};