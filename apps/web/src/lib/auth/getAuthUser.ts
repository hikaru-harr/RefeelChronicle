import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export function getAuthUser(): Promise<User | null> {
	if (auth.currentUser) return Promise.resolve(auth.currentUser);

	return new Promise((resolve) => {
		const unsub = onAuthStateChanged(auth, (user) => {
			unsub();
			resolve(user);
		});
	});
}
