"use client"

import { Button, Input } from "@nextui-org/react";

const Home = () => {
    return (
        <>
            <div className="w-screen h-screen">
                <div className="w-56">
                    <Input label="Email" type="text" size="sm" />
                </div>
                <Button color="success" variant="bordered" size="lg">Login</Button>

            </div>
        </>
    );
}

export default Home;