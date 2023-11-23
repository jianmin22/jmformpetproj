import { signIn, useSession, getSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";

import { api } from "~/utils/api";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      const redirectTo = "/memberHome";
      if (session?.user) {
        window.location.href = redirectTo;
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>JM FORM</title>
        <link rel="icon" href="" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-theme_purple">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex justify-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
              <span className="text-theme_orange">Welcome </span>
              <span className="text-theme_green">To </span>
              <span className="text-theme_orange">
                Form Creation Website By{" "}
              </span>
              <span className="text-theme_green">JMM</span>
            </h1>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-3xl text-white font-bold my-5">
              Sign In Now To Continue!
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  

  return (
    <div className="flex flex-col items-center justify-center gap-4">

      <button
        className="rounded-md bg-theme_green/90 px-10 py-3 mt-3 font-semibold text-white no-underline transition hover:bg-theme_green"
        onClick={()=>signIn()}
      >
        {"Sign in"}
      </button>
    </div>
  );
}
