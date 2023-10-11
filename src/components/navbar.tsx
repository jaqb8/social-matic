import { Webhook } from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center gap-2 bg-slate-200 p-6 text-2xl font-bold">
      <Webhook size={36} />
      SocialMatic
    </div>
  );
};

export default Navbar;
