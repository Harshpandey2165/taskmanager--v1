"use client";
import IconCheck from "@/public/icons/IconCheck";
import IconDeleteAll from "@/public/icons/IconDeleteAll";
import IconFileCheck from "@/public/icons/IconFileCheck";
import IconGrid from "@/public/icons/IconGrid";
import IconStopwatch from "@/public/icons/IconStopwatch";
import IconLogout from "@/public/icons/IconLogout";
import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function MiniSidebar() {
  const pathname = usePathname();
  const { logoutUser } = useUserContext();

  const getStrokeColor = (link: string) => {
    return pathname === link ? "#3aafae" : "#71717a";
  };

  const navItems = [
    {
      icon: <IconGrid strokeColor={getStrokeColor("/")} />,
      title: "All",
      link: "/",
    },
    {
      icon: <IconFileCheck strokeColor={getStrokeColor("/completed")} />,
      title: "Completed",
      link: "/completed",
    },
    {
      icon: <IconCheck strokeColor={getStrokeColor("/pending")} />,
      title: "Pending",
      link: "/pending",
    },
    {
      icon: <IconStopwatch strokeColor={getStrokeColor("/overdue")} />,
      title: "Overdue",
      link: "/overdue",
    },
  ];
  return (
    <div className="basis-[5rem] h-full flex flex-col bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] border-r border-gray-200">
      <div className="flex items-center justify-center h-[5rem] border-b border-gray-200">
        <Image src="/logo.png" width={32} height={32} alt="logo" className="hover:scale-110 transition-transform duration-200" />
      </div>

      <div className="mt-8 flex-1 flex flex-col items-center justify-between">
        <ul className="flex flex-col gap-8">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <Link href={item.link} className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl hover:bg-white/60 transition-all duration-200">
                {item.icon}
              </Link>

              {/* Hover Tooltip */}
              <span className="absolute top-[50%] translate-y-[-50%] left-16 text-xs pointer-events-none text-gray-700 bg-white px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                {item.title}
              </span>
            </li>
          ))}
        </ul>

        <div className="mb-[1.5rem] flex flex-col gap-4">
          <button className="w-12 h-12 mx-auto flex justify-center items-center bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-colors duration-200">
            <IconDeleteAll strokeColor="#dc2626" />
          </button>
          <button
            onClick={logoutUser}
            className="w-12 h-12 mx-auto flex justify-center items-center bg-gray-50 hover:bg-gray-100 p-2 rounded-xl transition-colors duration-200 relative group"
          >
            <IconLogout strokeColor="#71717a" />
            <span className="absolute top-[50%] translate-y-[-50%] left-16 text-xs pointer-events-none text-gray-700 bg-white px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniSidebar;
