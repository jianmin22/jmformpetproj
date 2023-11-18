import {signOut, useSession, getSession } from "next-auth/react";
import Head from "next/head";
import React, {useState,useEffect} from "react";

import { api } from "~/utils/api";
import AddForm from "~/components/addForm";
import ShowAllFormNames from "~/components/showAllFormNames";
export default function HomeMember() {
  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      const redirectTo = "/";
      if (!session?.user) {
        window.location.href = redirectTo;
      }
    };
    fetchData();
  }, []);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleFormAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <Head>
        <title>JM FORM</title>
        <link rel="icon" href="" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-slate-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Welcome To Form Creation Website By JMM
          </h1>
          <AddForm onFormAdded={handleFormAdded}/>
          <ShowAllFormNames key={refreshKey} />
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              Sign Out
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

  const { data: secretMessage } = api.form.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-md bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => void signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
