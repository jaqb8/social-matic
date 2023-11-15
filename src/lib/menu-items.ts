import { Archive, LayoutDashboard, Settings, User } from "lucide-react";

export const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Archive",
    icon: Archive,
    href: "/archive",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/#",
  },
  {
    name: "Account",
    icon: User,
    href: "/user-profile",
  },
] as const;
