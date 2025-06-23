import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import {Toaster} from "sonner";
import {AuthProvider} from "~/provider/auth-context";

const clientQuery = new QueryClient();

const ReactQueryProvider = ({children}: {children: React.ReactNode}) => {

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