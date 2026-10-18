import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* Global Fixed Halftone Texture Wallpaper Background - Dark Theme */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat dark:opacity-70 opacity-0 transition-opacity duration-300"
        style={{
          backgroundImage: "url('/assets/site-bg.png')",
          filter: "brightness(0.65)",
        }}
        aria-hidden="true"
      />

      {/* Global Fixed Halftone Texture Wallpaper Background - Light Theme */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat dark:opacity-0 opacity-20 transition-opacity duration-300"
        style={{
          backgroundImage: "url('/assets/site-bg-light.png')",
        }}
        aria-hidden="true"
      />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#171717",
            color: "#f5f5f5",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            fontSize: "13px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#0a0a0a",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <div className="relative z-10 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default App;
