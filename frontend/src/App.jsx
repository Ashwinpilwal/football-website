import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
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
      <Outlet />
    </>
  );
}

export default App;
