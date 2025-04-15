"use client";
import Modal from "@/app/Components/Modal/Modal";
import ProfileModal from "@/app/Components/Profile/ProfileModal";
import MiniSidebar from "@/app/Components/Layout/MiniSidebar";
import Sidebar from "@/app/Components/Sidebar/Sidebar";
import { useTasks } from "@/context/taskContext";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { isEditing, profileModal } = useTasks();
  return (
    <div className="flex flex-row min-h-screen w-full">
      {/* Mini Sidebar */}
      <div className="w-[60px] h-screen bg-white border-r border-gray-200 shadow-sm z-40 flex-shrink-0">
        <MiniSidebar />
      </div>
      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] min-h-screen overflow-x-auto">
        <div className="relative max-w-[1400px] mx-auto p-4">
          {isEditing && <Modal />}
          {profileModal && <ProfileModal />}
          {children}
        </div>
      </main>
      {/* Sidebar */}
      <div className="w-[340px] h-screen bg-white border-l border-gray-200 shadow-lg z-40 flex-shrink-0">
        <Sidebar />
      </div>
    </div>
  );
}

export default MainLayout;
