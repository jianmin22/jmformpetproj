import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import NavBar from "~/components/navBar";
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
      <NavBar />
      <main className=" bg-theme_purple flex min-h-screen flex-col items-center justify-center">
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

          <AddForm onFormAdded={handleFormAdded} />
          <ShowAllFormNames key={refreshKey} />
        </div>
      </main>
    </>
  );
}

