// src/components/Navbar.tsx
"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";

export function Navbar() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/main/home",
    },
    {
      title: "History",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/main/history",
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <FloatingDock
        items={links}
        desktopClassName="pointer-events-auto"
        mobileClassName="pointer-events-auto"
      />
    </div>
  );
}