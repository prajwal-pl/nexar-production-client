"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProfileQuery, useGetProjectsQuery } from "@/state/api";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const Sidebar = (props: Props) => {
  const router = useRouter();
  const { data: user } = useGetProfileQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  console.log(user);
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  const handleLogout = () => {
    if (user) {
      router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
    }
    //toast message saying login
  };
  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black sticky top-0">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            NEXAR
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        <nav className="z-10 w-full">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showProjects && (
          <>
            {projects?.map((project) => (
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/projects/${project.id}`}
              />
            ))}
          </>
        )}
        {/* <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button> */}
        {/* {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )} */}
      </div>
      {/* User Info with a logout button */}
      {user && (
        <div className="flex items-center justify-between px-4 py-6 border-t border-blue-100 sticky bottom-0 bg-white dark:bg-black">
          <div className="flex items-center gap-2">
            <User
              color={`${isDarkMode ? "#e5e7eb" : "#1f2937"}`}
              className="h-5 w-5"
            />
            <span className="text-gray-800 dark:text-white">
              {user?.user?.username || "User"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex justify-between cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
          <span className={`font-medium text-gray-800 dark:text-gray-100`}>
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Sidebar;
