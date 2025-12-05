'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useAuth from '@/features/auth/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})


function page() {
  const router = useRouter()
  const { handleLogin } = useAuth()
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  })

  const [requestState, setRequestState] = useState<{
    isLoading: boolean,
    error: boolean | null,
  }>({
    isLoading: false,
    error: null,
  })

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
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
    router.push('/')
    setRequestState({
      isLoading: true,
      error: null,
    })
  }

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-black mb-2'>Refeel Chronicle</h1>
      {
        requestState.error && <p className='text-red-500 mt-4 w-[320px] text-center border bg-red-50 border-red-500 py-2 rounded'>ログインに失敗しました。</p>
      }
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className='w-[320px] mt-2 space-y-4'>
          <FormField
            control={loginForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email<span className='text-red-500'>*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password<span className='text-red-500'>*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} type='password' />
                </FormControl>
                <FormDescription>8文字以上の半角英数字を入力してください。</FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full mt-2'>{requestState.isLoading ? <LoaderCircle className="mr-2 h-6 w-6 animate-spin" /> : 'Login'}</Button>
        </form>
      </Form>
    </div>
  )
}

export default page