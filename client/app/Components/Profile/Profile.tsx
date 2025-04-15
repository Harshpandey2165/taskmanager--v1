"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import React from "react";

function Profile() {
  const { user } = useUserContext();
  const { tasks, activeTasks, completedTasks, openProfileModal } = useTasks();
  return (
    <div className="m-6">
      <div
        className="px-4 py-4 flex items-center gap-4 bg-white/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer"
        onClick={openProfileModal}
      >
        <div className="relative">
          <Image
            src={user?.photo}
            alt="avatar"
            width={60}
            height={60}
            className="rounded-full ring-2 ring-offset-2 ring-[#3AAFAE]"
          />
        </div>
        <div>
          <h1 className="flex flex-col">
            <span className="text-gray-500 text-sm">Hello,</span>
            <span className="text-xl font-semibold text-gray-800">{user?.name}</span>
          </h1>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#6366f1]">{tasks.length}</span>
              <span className="text-xs text-gray-400">tasks</span>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">In Progress</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#3AAFAE]">{activeTasks.length}</span>
              <span className="text-xs text-gray-400">tasks</span>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Open Tasks</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#f59e0b]">{activeTasks.length}</span>
              <span className="text-xs text-gray-400">tasks</span>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Completed</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#10b981]">{completedTasks.length}</span>
              <span className="text-xs text-gray-400">tasks</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity</h3>
        <div className="bg-white/80 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Task completion improved by</p>
          <p className="text-2xl font-bold text-[#3AAFAE] mt-1">12% this month</p>
          <p className="text-xs text-gray-400 mt-2">Analysis based on tasks completed in the last 30 days</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
