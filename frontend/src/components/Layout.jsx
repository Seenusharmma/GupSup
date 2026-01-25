import { useLocation } from "react-router";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isChatPage = location.pathname.startsWith("/chat/");

  return (
    <div className="flex h-screen overflow-hidden antialiased bg-wa-gray-50 dark:bg-wa-gray-700 text-wa-gray-800 dark:text-wa-gray-100">
      {/* Sidebar - Hidden on mobile unless on home */}
      <div className={`${isHomePage ? "flex" : "hidden"} md:flex h-full`}>
        <Sidebar />
      </div>

      {/* Main Content - Hidden on mobile if on home, but we need to refine this for other tabs */}
      {/* On mobile: 
            - Home: Sidebar visible, Main hidden (usually) -> But Wait. 
            - Chat: Sidebar hidden, Main visible.
            - Updates/Calls: Sidebar hidden? No, these are main views replacing the Sidebar/Home view. 
            
            Actually, the original logic was:
            Mobile:
            - / : Sidebar (Chat List) is the "Main" view.
            - /chat/:id : Chat Window is the "Main" view.
            
            Now with tabs:
            - / : Sidebar (Chat List)
            - /updates : Placeholder (Main Content)
            - /communities : Placeholder (Main Content)
            - /calls : Placeholder (Main Content)
            
            So Sidebar should ONLY be visible on '/'.
            And Main Content should be visible on everything ELSE (Chat, Updates, etc).
            
            Let's adjust:
            Sidebar: visible on '/' AND desktop.
            Main: visible on NOT '/' OR desktop.
         */}
      <main
        className={`flex-1 flex flex-col min-w-0 relative overflow-hidden ${!isHomePage ? "flex" : "hidden"} md:flex transition-opacity duration-200`}
      >
        {children}
      </main>

      {/* Bottom Nav - Mobile Only, Hidden in active chat */}
      {!isChatPage && <BottomNav />}
    </div>
  );
};

export default Layout;
