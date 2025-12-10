import { addMonths, format, isAfter, startOfMonth } from "date-fns";
import { useMemo, useState } from "react";

const useTimeLine = () => {
	const [currentMonth, setCurrentMonth] = useState(() =>
		startOfMonth(new Date()),
	);

	const yearMonthParam = useMemo(() => {
		return format(currentMonth, "yyyy-MM");
	}, [currentMonth]);

	const todayMonth = useMemo(() => startOfMonth(new Date()), []);

	const label = useMemo(() => {
		return format(currentMonth, "yyyy年MM月");
	}, [currentMonth]);

	const handlePrevMonth = () => {
		setCurrentMonth((prev) => addMonths(prev, -1));
	};
	const canGoNext = useMemo(() => {
		const next = startOfMonth(addMonths(currentMonth, 1));

		// 次月の1日が today より後ならダメ
		return !isAfter(next, todayMonth);
	}, [currentMonth, todayMonth]);

	const handleNextMonth = () => {
		if (!canGoNext) return;
		setCurrentMonth((prev) => addMonths(prev, 1));
	};

	return {
		currentMonth,
		yearMonthParam,
		label,
		handlePrevMonth,
		handleNextMonth,
		canGoNext,
	};
};

export default useTimeLine;
