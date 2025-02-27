"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SidebarContext = React.createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { collapsed, setCollapsed } = React.useContext(SidebarContext);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("", className)}
      onClick={() => setCollapsed(!collapsed)}
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

export function SidebarInset({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { collapsed } = React.useContext(SidebarContext);

  return (
    <div
      className={cn(
        "transition-[margin-left] duration-300 ease-in-out",
        collapsed ? "ml-0" : "ml-[250px]",
        className
      )}
    >
      {children}
    </div>
  );
}
