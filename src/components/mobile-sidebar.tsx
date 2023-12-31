import { useUser } from "@clerk/nextjs";
import { LogOut, X } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { menuItems } from "@/lib/menu-items";

interface MobileSidebarProps {
  onOpen: () => void;
  isOpen: boolean;
}

const MobileSidebar = ({ onOpen, isOpen }: MobileSidebarProps) => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-50 w-[300px] bg-slate-500 px-6 py-4 text-center text-slate-100 transition-transform ${
        !isOpen && "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <X className="cursor-pointer" onClick={onOpen} size={32} />
        <div className="flex gap-4 pb-12 pt-6 text-start">
          <Image
            src={user.imageUrl}
            alt="Profile image"
            width={50}
            height={50}
            className="rounded-2xl pb-2"
          />
          <div className="block">
            <h1 className="text-xl font-bold">
              {user.username ? user.username : user.firstName}
            </h1>
            <p className="text-sm">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex gap-2 p-2 font-bold">
                  {<Icon />}
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex gap-2 px-2 pb-8 font-bold">
          <LogOut />
          Logout
        </div>
      </div>
    </aside>
  );
};

export default MobileSidebar;
