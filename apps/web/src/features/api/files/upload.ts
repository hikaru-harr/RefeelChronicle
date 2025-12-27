export const uploadFile = async (
	preSignedUrl: string,
	file: File,
): Promise<boolean> => {
	const response = await fetch(preSignedUrl, {
		method: "PUT",
		headers: {
			"Content-Type": file.type,
		},
		body: file,
	});
	console.log(`uploadFile success ${preSignedUrl}`);
	if (!response.ok) {
		console.error(`uploadFile error ${preSignedUrl}`);
		return false;
	}
	return true;
};
