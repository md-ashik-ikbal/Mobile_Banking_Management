"use client"

import Routes from "@/app/routes/route";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const Home = () => {
    return (
        <>
            <div className="">
                <h1>Welcome to home</h1>
                <Button
                    as={Link}
                    href={Routes.Login}
                    radius="sm"
                    color="primary"
                >
                    Log in
                </Button>
            </div>
        </>
    );
}

export default Home;