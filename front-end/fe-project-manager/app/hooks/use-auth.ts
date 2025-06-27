import {useMutation} from "@tanstack/react-query";
import type {SignUpFormData} from "~/routes/auth/sign-up";
import {postData} from "~/lib/fetch-utils";

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data:SignUpFormData) => postData("auth/register", data)
    })
}

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: (data:{token: string}) => postData("auth/verify-email", data)
    })
}