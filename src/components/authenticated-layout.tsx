import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { type PropsWithChildren } from "react";
import { Skeleton } from "./ui/skeleton";

const AuthenticatedLayout = (props: PropsWithChildren) => {
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
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <Skeleton className="hidden sm:block sm:w-72" />;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <aside className="hidden w-72 p-10 sm:block">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-1">
            <Image
              src={user.imageUrl}
              alt="Profile image"
              width={80}
              height={80}
              className="rounded-2xl"
            />
            <h1 className="text-xl font-bold">
              {user.username ? user.username : user.firstName}
            </h1>
            <p className="text-sm">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div>
            <li className="flex list-none flex-col gap-3 font-bold">
              <ul className="cursor-pointer hover:text-primary">
                <Link href="/dashboard">Dashboard</Link>
              </ul>
              <ul className="cursor-pointer hover:text-primary">
                <Link href="/archive">Archive</Link>
              </ul>
              <ul className="cursor-pointer hover:text-primary">Settings</ul>
              <ul className="cursor-pointer hover:text-primary">Account</ul>
            </li>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AuthenticatedLayout;
