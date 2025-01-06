"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Routes from "./routes/route";
import Spinner from "./components/spinner/spinner";

export default function Home() {
  const Router = useRouter();
  useEffect(() => { Router.push(Routes.Home) }, []);
  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex justify-center items-center">
        <div className="absolute w-8 h-8">
          <Spinner />
        </div>
        <div className="relative top-9">
          <p>Please Wait While The Page Is Being Loaded.</p>
        </div>
      </div>
    </>
  );
}
