import React, { useEffect, useState } from "react";
import { signOut, useSession, getSession } from "next-auth/react";
import { User } from "lucide-react";
import { Disclosure } from "@headlessui/react";
import { useRouter } from "next/router";

function AuthShowcase() {
    const { data: sessionData } = useSession();
  
    return (
        <button
          className="bg-theme_orange/90 hover:bg-theme_orange rounded-md px-10 py-3 font-semibold text-white no-underline transition mr-5"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
    );
  }

  
const NavBar = () => {
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      const redirectTo = "/";
      if (!session?.user) {
        router.push(redirectTo);
      } else {
        setUserProfileImage(session?.user.image ?? null);
        setUserName(session?.user?.name??null);
      }
    };

    fetchSession();
  }, [router]);

  return (
    <Disclosure as="nav" className="bg-white h-20 flex items-center justify-between shadow-md">

  {({ open }) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center cursor-pointer" onClick={()=>{window.location.href = "/memberAccessPage/memberHome";}}>
        <img
          className="h-8 w-auto ml-5"
          src="https://images.freeimages.com/fic/images/icons/1514/doraemon/256/doraemon.png"
          alt=""
        />
        <span className="ml-2 font-bold text-lg">JM</span>
      </div>

      <div className="relative ml-3 flex justify-center">
      {userProfileImage ? (
              <img
                className="h-8 w-8 rounded-full mr-5 mt-2"
                src={userProfileImage}
                alt="Your Profile"
                title={"Logged in as " + userName}
              />
            ) : (
              <User className="h-8 w-8 rounded-full mr-2 mt-2 text-gray-500" />
            )}
            <AuthShowcase />
      </div>
    </div>
  )}
</Disclosure>

  );
};

export default NavBar;
