"use client";
import React from "react";
import { Home, Star, Check, Trash } from "@/utils/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MiniSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Pending",
      href: "/pending",
      icon: Star,
    },
    {
      label: "Completed",
      href: "/completed",
      icon: Check,
    },
    {
      label: "Overdue",
      href: "/overdue",
      icon: Trash,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex h-full flex-col items-center py-4 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors ${pathname === item.href ? 'bg-gray-100' : ''}`}
            title={item.label}
          >
            <item.icon />
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default MiniSidebar;