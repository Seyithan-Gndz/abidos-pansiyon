"use client";

import { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="min-h-screen bg-[#f3f5f6] lg:grid lg:grid-cols-[256px_1fr]"><AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)}/><div className="min-w-0"><AdminHeader onMenu={() => setMenuOpen(true)}/>{children}</div></div>;
}

