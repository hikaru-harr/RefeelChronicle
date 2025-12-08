import { format } from "date-fns";

export const buildUserMonthPrefix = (userId: string, date: Date) => {
	const year = format(date, "yyyy");
	const month = format(date, "MM");
	return `${userId}/${year}/${month}`;
};

export const buildUserFileKey = (
	userId: string,
	date: Date,
	fileName: string,
) => {
	return `${buildUserMonthPrefix(userId, date)}/${fileName}`;
};
