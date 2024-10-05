"use client";
import React, { useState } from "react";
import {
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserCircle2Icon,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/state/api";
import { Button } from "@mui/material";
import Image from "next/image";

const Navbar = () => {
  const { data: profile } = useGetProfileQuery();
  console.log(profile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  //   }
  //   const fetchProfile = () => {
  //     fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": "true",
  //         Accept: "application/json",
  //         "Allow-Content-Allow-Origin": "http://localhost:3000",
  //       },
  //     })
  //       .then((response) => {
  //         if (response.status === 200) return response.json();
  //         throw new Error("authentication has been failed!");
  //       })
  //       .then((resObject) => {
  //         setProfile(resObject.user);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  //   fetchProfile();
  // }, [isLoggedIn]);
  const handleLogin = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
  };
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/results?search=${searchTerm}`);
            }}
          >
            <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            />
          </form>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>
        <Link
          className={
            isDarkMode
              ? `h-min w-min rounded p-2`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }
          href="/settings"
        >
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>
        <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
        <div>
          <Button
            variant={`${profile?.user ? "text" : "contained"}`}
            onClick={profile ? handleLogout : handleLogin}
          >
            {profile?.user ? (
              <>
                {profile?.user?.profilePictureUrl ? (
                  <Image
                    src={profile?.user?.profilePictureUrl || ""}
                    alt="profile"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                ) : (
                  <UserCircle2Icon className="h-6 w-6 cursor-pointer dark:text-white" />
                )}
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
