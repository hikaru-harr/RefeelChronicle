import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { auth } from "@/lib/firebaseClient";

export const loginFormSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

const useAuth = () => {
	const router = useRouter();

	const [requestState, setRequestState] = useState<{
		isLoading: boolean;
		error: boolean | null;
	}>({
		isLoading: false,
		error: null,
	});

	const handleLogin = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			const jwtToken = await result.user.getIdToken();
			localStorage.setItem("jwtToken", jwtToken);
			return true;
		} catch (error) {
			console.error("Error logging in:", error);
			return null;
		}
	};

	const onSubmit = async (data: LoginFormSchema) => {
		setRequestState({
			isLoading: true,
			error: null,
		});
		const result = await handleLogin(data);
		if (!result) {
			setRequestState({
				isLoading: false,
				error: true,
			});
			return;
		}

		router.replace("/files");
		setRequestState({
			isLoading: true,
			error: null,
		});
	};

	return { handleLogin, onSubmit, requestState };
};

export default useAuth;
