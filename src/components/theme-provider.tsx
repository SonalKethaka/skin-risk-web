"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"       // adds "class='dark'" to <html>
      defaultTheme="system"   // uses OS theme by default
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}