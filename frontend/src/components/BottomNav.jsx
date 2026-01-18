import { MessageSquare, RefreshCw, Users, Phone } from "lucide-react";
import { useLocation, Link } from "react-router";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => {
    if (route === "/") return path === "/";
    return path.startsWith(route);
  };

  const navItems = [
    { id: "chats", label: "Chats", icon: MessageSquare, route: "/" },
    { id: "updates", label: "Updates", icon: RefreshCw, route: "/updates" },
    { id: "communities", label: "Communities", icon: Users, route: "/communities" },
    { id: "calls", label: "Calls", icon: Phone, route: "/calls" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#1f2c34] border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-2 z-40 pb-safe">
      {navItems.map((item) => {
        const active = isActive(item.route);
        return (
          <Link
            key={item.id}
            to={item.route}
            className={`flex flex-col items-center gap-1 py-1 px-4 min-w-[64px] rounded-lg transition-colors ${
              active 
                ? "text-[#00a884] font-medium" 
                : "text-[#54656f] dark:text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <div className={`relative px-4 py-0.5 rounded-full ${active ? "bg-[#daf8e6] dark:bg-[#00332a]" : ""}`}>
                 <item.icon className={`w-6 h-6 ${active ? "fill-current" : ""}`} strokeWidth={active ? 2.5 : 2} />
            </div>
            <span className="text-[12px] leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
