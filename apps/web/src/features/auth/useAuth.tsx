import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from 'zod'

export const loginFormSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>

const useAuth = () => {
    const router = useRouter()

    const [requestState, setRequestState] = useState<{
        isLoading: boolean,
        error: boolean | null,
    }>({
        isLoading: false,
        error: null,
    })

    const handleLogin = async ({ email, password }: { email: string, password: string }) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true
        } catch (error) {
            console.error("Error logging in:", error);
            return false
        }
    };

    const onSubmit = async (data: LoginFormSchema) => {
        setRequestState({
            isLoading: true,
            error: null,
        })
        const result = await handleLogin(data)
        if (!result) {
            setRequestState({
                isLoading: false,
                error: true,
            })
            return
        }
        router.push('/files')
        setRequestState({
            isLoading: true,
            error: null,
        })
    }


    return ({ handleLogin, onSubmit, requestState })
}

export default useAuth