"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth, {
	type LoginFormSchema,
	loginFormSchema,
} from "@/features/auth/useAuth";

function page() {
	const { requestState, onSubmit } = useAuth();

	const loginForm = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
	});

	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<h1 className="text-2xl font-black mb-2">Refeel Chronicle</h1>
			{requestState.error && (
				<p className="text-red-500 mt-4 w-[320px] text-center border bg-red-50 border-red-500 py-2 rounded">
					ログインに失敗しました。
				</p>
			)}
			<Form {...loginForm}>
				<form
					onSubmit={loginForm.handleSubmit(onSubmit)}
					className="w-[320px] mt-2 space-y-4"
				>
					<FormField
						control={loginForm.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Email<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Email" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={loginForm.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Password<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Password" {...field} type="password" />
								</FormControl>
								<FormDescription>
									8文字以上の半角英数字を入力してください。
								</FormDescription>
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full mt-2">
						{requestState.isLoading ? (
							<LoaderCircle className="mr-2 h-6 w-6 animate-spin" />
						) : (
							"Login"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}

export default page;
