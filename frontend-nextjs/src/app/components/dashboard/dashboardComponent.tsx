"use client"

import useProfile from "@/app/hooks/user/useProfile";
import { NextApiRequest } from "next";
import { useEffect, useState } from "react";

const DashboardComponent = (nr: NextApiRequest) => {
    const [user, setUser] = useState<string | null>(null);

    const extract_token_from_header = (request: NextApiRequest): string | undefined => {
        return request.headers.authorization?.split(' ')[1];
    }

    useEffect(() => {
        const get_user = async () => {
            
        }

        get_user();

    }, []);

    

    if(!user) {
        return(
            <>
                <h1>Unautorized</h1>
            </>
        );
    }

    return(
        <>
            <h1> Welcome </h1>
        </>
    );
}

export default DashboardComponent;