import { useLocation } from "react-router";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex h-screen overflow-hidden antialiased bg-wa-gray-50 dark:bg-wa-gray-700 text-wa-gray-800 dark:text-wa-gray-100">
        {/* Sidebar - Hidden on mobile unless on home */}
        <div className={`${isHomePage ? 'flex' : 'hidden'} md:flex h-full`}>
            <Sidebar />
        </div>
        
        {/* Main Content - Hidden on mobile if on home */}
        <main className={`flex-1 flex flex-col min-w-0 relative overflow-hidden ${!isHomePage ? 'flex' : 'hidden'} md:flex`}>
            {children}
        </main>
    </div>
  );
};

export default Layout;
