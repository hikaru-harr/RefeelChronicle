import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

const useAuth = () => {

    const handleLogin = async ({ email, password }: { email: string, password: string }) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };
    return ({ handleLogin })
}

export default useAuth