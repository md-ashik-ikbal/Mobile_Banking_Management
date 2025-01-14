import LoginComponent from "@/app/components/auth/loginComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log In",
};

const Login = () => {
    return (
        <>
           <LoginComponent />
        </>
    );
}

export default Login;