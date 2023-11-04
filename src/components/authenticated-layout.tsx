import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { type PropsWithChildren } from "react";
import { Skeleton } from "./ui/skeleton";
import { menuItems } from "@/lib/menu-items";

const AuthenticatedLayout = (props: PropsWithChildren) => {
  return (
    <main className="h-screen p-10">
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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 px-2">
            <Image
              src={user.imageUrl}
              alt="Profile image"
              width={80}
              height={80}
              className="rounded-2xl"
            />
            <div>
              <h1 className="text-xl font-bold">
                {user.username ? user.username : user.firstName}
              </h1>
              <p className="text-sm">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <div className="border-b-4 border-dotted"></div>
          <div>
            <li className="flex list-none flex-col gap-3 font-bold">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={`/${item.href}`}>
                    <ul className="flex cursor-pointer items-center gap-2 rounded-md  from-slate-500 to-purple-950 px-4 py-2 hover:bg-gradient-to-r hover:text-slate-100 hover:drop-shadow-md">
                      <Icon size={20} />
                      {item.name}
                    </ul>
                  </Link>
                );
              })}
            </li>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AuthenticatedLayout;
