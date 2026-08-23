import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import store from "./store/store.js";
import { Provider } from "react-redux";

import AuthInitializer from "./components/AuthInitializer.jsx";
import LocationInitializer from "./components/LocationInitializer.jsx";

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";

// Connected Screen Pages
import HomePage from "./pages/HomePage.jsx";
import FindTurfsPage from "./pages/FindTurfsPage.jsx";
import LiveRadarPage from "./pages/LiveRadarPage.jsx";
import TurfDetailPage from "./pages/TurfDetailPage.jsx";
import BookingConfirmationPage from "./pages/BookingConfirmationPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import CommunityFeedPage from "./pages/CommunityFeedPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LiveMatchesPage from "./pages/LiveMatchesPage.jsx";
import FootballAIPage from "./pages/FootballAIPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";

// Auth & Session Pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import SessionWarmupPage from "./pages/SessionWarmupPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // App Layout Shell for Core Features
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/find-turfs", element: <FindTurfsPage /> },
          { path: "/live-turfs", element: <LiveRadarPage /> },
          { path: "/turfs/:turfId", element: <TurfDetailPage /> },
          { path: "/turf/:turfId", element: <TurfDetailPage /> },
          { path: "/booking-confirmation/:bookingId", element: <BookingConfirmationPage /> },
          { path: "/my-bookings", element: <MyBookingsPage /> },
          { path: "/feed", element: <CommunityFeedPage /> },
          { path: "/community", element: <CommunityFeedPage /> },
          { path: "/post/:postId", element: <PostDetailPage /> },
          { path: "/messages", element: <MessagesPage /> },
          { path: "/create-post", element: <CreatePostPage /> },
          { path: "/channel/:username", element: <ProfilePage /> },
          { path: "/profile/:username", element: <ProfilePage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/live-matches", element: <LiveMatchesPage /> },
          { path: "/ai", element: <FootballAIPage /> },
          { path: "/football-ai", element: <FootballAIPage /> },
          // Catch-all inside app shell
          { path: "*", element: <Navigate to="/" replace /> },
        ],
      },

      // Fullscreen Standalone Auth & Session Pages
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/session-warmup", element: <SessionWarmupPage /> },

      // Global Catch-all redirect to Home page
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <AuthInitializer>
        <LocationInitializer />
        <RouterProvider router={router} />
      </AuthInitializer>
    </ThemeProvider>
  </Provider>
);
