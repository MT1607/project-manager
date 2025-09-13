import {useMutation} from "@tanstack/react-query";
import type {SignUpFormData} from "@/routes/auth/sign-up";
import {postData} from "@/lib/fetch-utils";

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data: SignUpFormData) => postData("auth/register", data)
    })
}

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: (data: { token: string }) => postData("auth/verify-email", data)
    })
}

export const useLoginUser = () => {
    return useMutation({
        mutationFn: (data: { email: string, password: string }) => postData("auth/login", data)
    })
}

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (data: { email: string }) => postData("auth/reset-password-request", data)
    })
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: {
            token: string,
            newPassword: string,
            confirmPassword: string
        }) => postData("auth/reset-password", data)
    })
}