"use client"

import LoginSkeleton from "@/app/components/skeletons/loginSkeleton";
import dynamic from "next/dynamic";

const LoginComponent = () => {
    const LoginForm = dynamic(async () => {
        return await import("@/app/components/auth/loginForm");
    }, {
        ssr: false,
        loading: () => {
            return (
                <>
                    <LoginSkeleton />
                </>
            );
        }
    }
    );
    
    return (
        <>
           <LoginForm />
        </>
    );
}

export default LoginComponent;