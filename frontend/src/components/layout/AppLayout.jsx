import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    if (sidebarExpanded) {
      document.documentElement.setAttribute("data-sidebar-expanded", "true");
    } else {
      document.documentElement.removeAttribute("data-sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-h-screen bg-[#070b10] text-neutral-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-neutral-950 relative overflow-x-hidden w-full max-w-full">
      {/* Desktop Sidebar Container with smooth width expansion that shifts content right */}
      <div
        className={`hidden md:block shrink-0 relative z-30 sidebar-desktop-spacer ${
          sidebarExpanded ? "w-72" : "w-28"
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <Sidebar isExpanded={sidebarExpanded} />
      </div>

      {/* Mobile Drawer Sidebar with smooth open/close slide transition */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto bg-black/80"
            : "opacity-0 pointer-events-none bg-black/0"
        }`}
      >
        <div
          className={`w-72 sm:w-80 h-full bg-[#0a0f16] p-0 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onCloseMobile={() => setMobileOpen(false)} isMobile={true} />
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => setMobileOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10 w-full overflow-x-hidden">
        <Navbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 px-3 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-5 md:py-6 lg:py-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 min-w-0">
          <Outlet />
        </main>
        {/* Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
}

