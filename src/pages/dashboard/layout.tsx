import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { type PropsWithChildren } from "react";

const DashboardLayout = (props: PropsWithChildren) => {
  return (
    <main className="h-screen p-4">
      <div className="flex gap-8">
        <Sidebar />
        {props.children}
      </div>
    </main>
  );
};

const Sidebar = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="hidden w-72 p-10 sm:block">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <Image
            src={user.imageUrl}
            alt="Profile image"
            width={80}
            height={80}
            className="rounded-2xl"
          />
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-sm">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div>
          <li className="flex list-none flex-col gap-3 font-bold">
            <ul className="cursor-pointer hover:text-primary">
              <Link href="/dashboard">Dashboard</Link>
            </ul>
            <ul className="cursor-pointer hover:text-primary">Archive</ul>
            <ul className="cursor-pointer hover:text-primary">Settings</ul>
            <ul className="cursor-pointer hover:text-primary">Account</ul>
          </li>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
