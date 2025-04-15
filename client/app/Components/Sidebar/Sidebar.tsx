import React from "react";
import Profile from "../Profile/Profile";
import { useUserContext } from "@/context/userContext";
import { useTasks } from "@/context/taskContext";

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Task Completion</span>
        <span className="text-xs font-semibold text-gray-500">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-[#3AAFAE] h-3 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

function Sidebar() {
  const { logoutUser } = useUserContext();
  const { tasks, completedTasks } = useTasks();
  const percent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <aside className="h-full w-[340px] min-w-[220px] max-w-[98vw] bg-white rounded-xl shadow-lg flex flex-col justify-between items-center py-10 px-8 transition-all duration-300 overflow-hidden">
      <div className="w-full flex flex-col items-center gap-10">
        <Profile />
        <ProgressBar percent={percent} />
      </div>
      <button
        className="w-full mt-10 py-3 bg-[#EB4E31] text-white rounded-lg hover:bg-[#3aafae] transition duration-200 ease-in-out text-base font-semibold shadow-md"
        onClick={logoutUser}
      >
        Sign Out
      </button>
    </aside>
  );
}

export default Sidebar;
