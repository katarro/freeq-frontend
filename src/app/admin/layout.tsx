"use client";

import { ReactNode } from "react";
import FreeqNavigationBar from "@/components/freeq-navigation-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import FreeqSidebar from "@/components/freeq-sidebar";
import FreeqHeader from "@/components/freeq-header";

export default function AdminLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
        <SidebarProvider>
          <FreeqSidebar />
          <SidebarInset className="relative">
            <FreeqHeader />
            <main className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden pb-[55px]">
              {children}
            </main>
            <FreeqNavigationBar />
          </SidebarInset>
        </SidebarProvider>
    </div>
  );
}

