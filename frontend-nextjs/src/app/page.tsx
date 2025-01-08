"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Routes from "./routes/route";
import { FullScreenSpinner } from "./components/spinner/spinner";

export default function Home() {
  const Router = useRouter();
  useEffect(() => { Router.push(Routes.Home) }, []);
  return (
    <>
      <FullScreenSpinner />
    </>
  );
}
