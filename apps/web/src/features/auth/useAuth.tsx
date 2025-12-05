import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

const useAuth = () => {

    const handleLogin = async ({ email, password }: { email: string, password: string }) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true
        } catch (error) {
            console.error("Error logging in:", error);
            return false
        }
    };
    return ({ handleLogin })
}

export default useAuth