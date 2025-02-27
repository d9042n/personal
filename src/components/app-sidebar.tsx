"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Settings, Bell, LogOut } from "lucide-react";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarContext } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

const sidebarItems = [
  {
    title: "Home",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { collapsed } = useContext(SidebarContext);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed left-0 flex h-screen flex-col border-r bg-sidebar-background transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[0px] -translate-x-full" : "w-[250px] translate-x-0"
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href={`/dashboard/${user.username}`}
          className="flex items-center gap-2 font-semibold"
        >
          <span className="text-lg">Dashboard</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
