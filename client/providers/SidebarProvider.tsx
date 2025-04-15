"use client";
import Sidebar from "@/app/Components/Sidebar/Sidebar";
import MiniSidebar from "@/app/Components/MiniSidebar/MiniSidebar";
import { useUserContext } from "@/context/userContext";
import { usePathname } from "next/navigation";
import React from "react";

function SidebarProvider() {
  const userId = useUserContext().user._id;
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      {userId && !isAuthPage && (
        <div className="flex fixed inset-0 h-screen bg-gray-50">
          <div className="h-full w-16 flex-shrink-0 bg-white border-r border-gray-200 shadow-sm z-40">
            <MiniSidebar />
          </div>
          <div className="flex-1 ml-20 p-6 overflow-auto">
            {/* Main content area will be rendered here */}
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarProvider;
