"use client";
import Modal from "@/app/Components/Modal/Modal";
import ProfileModal from "@/app/Components/Profile/ProfileModal";
import MiniSidebar from "@/app/Components/Layout/MiniSidebar";
import { useTasks } from "@/context/taskContext";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { isEditing, profileModal } = useTasks();
  return (
    <div className="flex min-h-screen">
      <div className="w-16 flex-shrink-0 fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-40">
        <MiniSidebar />
      </div>
      <div className="flex-1 ml-16 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] overflow-auto">
        <div className="relative h-full w-full p-6">
          {isEditing && <Modal />}
          {profileModal && <ProfileModal />}
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
