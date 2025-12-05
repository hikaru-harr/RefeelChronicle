'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useAuth from '@/features/auth/useAuth'
import { useRouter } from 'next/navigation'

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

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    await handleLogin(data)
    router.push('/')
  }
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-black'>Refeel Chronicle</h1>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className='w-[320px] mt-6 space-y-4'>
          <FormField
            control={loginForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full'>Login</Button>
        </form>
      </Form>
    </div>
  )
}

export default page