"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import { github, moon, profile } from "@/utils/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import Modal from "../Modal/Modal";

function Header() {
  const { user } = useUserContext();
  const { openModalForAdd, activeTasks, isEditing } = useTasks();

  const router = useRouter();

  const name = user?.name || '';
  const userId = user?._id;


  return (
    <header className="px-8 py-6 w-full flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="wave" className="text-3xl">
            👋
          </span>
          {userId ? `Welcome, ${name}!` : "Welcome to Taskfyer"}
        </h1>
        <p className="mt-1 text-[15px] text-gray-600">
          {userId ? (
            <>
              You have{" "}
              <span className="font-semibold text-[#7263F3]">
                {activeTasks.length}
              </span>
              &nbsp;active tasks
            </>
          ) : (
            "Please login or register to view your tasks"
          )}
        </p>
      </div>
      <div className="flex items-center gap-8">
        <button
          className="px-6 py-2.5 bg-gradient-to-r from-[#7263F3] to-[#6F5FF3] text-white rounded-lg
          hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 font-medium text-[15px]"
          onClick={() => {
            if (userId) {
              openModalForAdd();
            } else {
              router.push("/login");
            }
          }}
        >
          {userId ? "Add a new Task" : "Login / Register"}
        </button>

        <div className="flex gap-3 items-center">
          <Link
            href="https://github.com/Maclinz/taskfyer"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 text-[#7263F3] rounded-lg flex items-center justify-center text-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            {github}
          </Link>
          <Link
            href="https://github.com/Maclinz/taskfyer"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 text-[#7263F3] rounded-lg flex items-center justify-center text-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            {moon}
          </Link>
          <Link
            href="https://github.com/Maclinz/taskfyer"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 text-[#7263F3] rounded-lg flex items-center justify-center text-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            {profile}
          </Link>
        </div>
      </div>
      {isEditing && <Modal />}
    </header>
  );
}

export default Header;
