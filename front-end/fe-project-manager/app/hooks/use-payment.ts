import { postData } from "@/lib/fetch-utils";
import {useMutation} from "@tanstack/react-query";

export const useCreateMomoPayment = () => {
    return useMutation({
        mutationFn: () => postData("payment/momo/create-payment", { })
    })
}

export const useHandleMomoIPN = () => {
    return useMutation({
        mutationFn: () => postData("payment/momo/ipn", { })
    })
}