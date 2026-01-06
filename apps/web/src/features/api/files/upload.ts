import axios from "axios";

export const uploadFile = async (
	preSignedUrl: string,
	file: File,
): Promise<boolean> => {
	const response = await axios.put(preSignedUrl, file, {
		headers: {
			"Content-Type": file.type,
		},
	});
	console.log(`uploadFile success ${preSignedUrl}`);
	if (response.status !== 200) {
		console.error(`uploadFile error ${preSignedUrl}`);
		return false;
	}
	return true;
};
