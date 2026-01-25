import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import DiscoverPage from "./pages/DiscoverPage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "./lib/api.js";
import SelectChatPlaceholder from "./components/SelectChatPlaceholder.jsx";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const [chatClient, setChatClient] = useState(null);

  const { data: tokenData, isLoading: isTokenLoading } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!authUser || !tokenData?.token || chatClient) return;

      const client = StreamChat.getInstance(STREAM_API_KEY);

      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic?.startsWith("data:")
            ? undefined
            : authUser.profilePic,
        },
        tokenData.token,
      );

      setChatClient(client);
    };

    if (authUser && tokenData) {
      initChat();
    }
  }, [authUser, tokenData, chatClient]);

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (
    isLoading ||
    (isAuthenticated && isTokenLoading) ||
    (isAuthenticated && !chatClient)
  )
    return <PageLoader />;

  return (
    <div className="h-screen overflow-hidden" data-theme={theme}>
      {isAuthenticated && chatClient ? (
        <Chat client={chatClient} theme={`messaging ${theme}`}>
          <Routes>
            <Route
              path="/"
              element={
                isOnboarded ? (
                  <Layout>
                    <HomePage />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />
            <Route
              path="/chat/:id"
              element={
                isOnboarded ? (
                  <Layout>
                    <ChatPage />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />
            <Route
              path="/notifications"
              element={
                isOnboarded ? (
                  <Layout>
                    <NotificationsPage />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />
            {/* Friends/Home equivalent if needed, for now / is placeholder */}
            <Route
              path="/friends"
              element={
                isOnboarded ? (
                  <Layout>
                    <HomePage />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />

            <Route path="/call/:id" element={<CallPage />} />

            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route
              path="/onboarding"
              element={!isOnboarded ? <OnboardingPage /> : <Navigate to="/" />}
            />
            <Route
              path="/discover"
              element={
                isOnboarded ? (
                  <Layout>
                    <DiscoverPage />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isOnboarded ? (
                  <Layout>
                    <ProfilePage />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />
            <Route
              path="/updates"
              element={
                isOnboarded ? (
                  <Layout>
                    <PlaceholderPage title="Updates" />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />
            <Route
              path="/communities"
              element={
                isOnboarded ? (
                  <Layout>
                    <PlaceholderPage title="Communities" />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />
            <Route
              path="/calls"
              element={
                isOnboarded ? (
                  <Layout>
                    <PlaceholderPage title="Calls" />
                  </Layout>
                ) : (
                  <Navigate to="/onboarding" />
                )
              }
            />
          </Routes>
        </Chat>
      ) : (
        <Routes>
          <Route
            path="/signup"
            element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/onboarding"
            element={
              isAuthenticated && !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

      <Toaster />
    </div>
  );
};
export default App;
