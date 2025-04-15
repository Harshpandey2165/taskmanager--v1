"use client";
import { useUserContext } from "@/context/userContext";
import React from "react";

interface MainContentLayoutProps {
  children: React.ReactNode;
}

function MainContentLayout({ children }: MainContentLayoutProps) {
  const userId = useUserContext().user._id;
  return (
    <main className="flex-1 min-h-0 flex flex-col p-4 md:p-6 lg:p-8 overflow-auto">
      <div className="flex-1 w-full h-full max-w-7xl mx-auto space-y-6">
        {children}
      </div>
    </main>
  );
}

export default MainContentLayout;
