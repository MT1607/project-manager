import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "sonner";
import {AuthProvider} from "@/provider/auth-context";
import type { ReactNode } from "react";

const clientQuery = new QueryClient();

const ReactQueryProvider = ({children}: {children: ReactNode}) => {

    return (
        <QueryClientProvider client={clientQuery}>
            <AuthProvider>
                {children}
                <Toaster position={"top-right"} richColors/>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default ReactQueryProvider;