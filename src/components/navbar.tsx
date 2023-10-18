import { Menu, Webhook, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import MobileSidebar from "./mobile-sidebar";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isSidebarOpen, toggleSidebar] = useState(false);
  const dynamicRoute = useRouter().asPath;

  useEffect(() => toggleSidebar(false), [dynamicRoute]);

  return (
    <>
      <div className="flex bg-slate-200 p-6 text-2xl font-bold">
        <div className="flex w-full items-center">
          <Menu
            className="flex-none cursor-pointer sm:hidden"
            onClick={() => toggleSidebar(!isSidebarOpen)}
            size={32}
          />
          <div className="flex w-full flex-initial items-center justify-center gap-1 sm:justify-start">
            <Webhook size={28} />
            SocialMatic
          </div>
        </div>
      </div>
      <MobileSidebar
        isOpen={isSidebarOpen}
        onOpen={() => toggleSidebar(!isSidebarOpen)}
      />
    </>
  );
};

export default Navbar;
