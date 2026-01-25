import { useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { ChannelList, useChatContext } from "stream-chat-react";
import {
  LogOutIcon,
  MessageSquarePlus,
  MoreVertical,
  CircleDashed,
  Users,
  Globe,
} from "lucide-react";
import { useState } from "react";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import CustomChannelPreview from "./CustomChannelPreview";
import Avatar from "./Avatar";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const { client } = useChatContext();
  const { logoutMutation } = useLogout();

  const filters = { type: "messaging", members: { $in: [authUser?._id] } };
  const sort = { last_message_at: -1 };

  return (
    <aside className="w-full md:w-1/3 lg:w-[400px] flex flex-col h-full border-r border-wa-gray-200 dark:border-wa-gray-600 bg-white dark:bg-wa-gray-800">
      {/* Header */}
      <div className="h-[60px] flex items-center justify-between px-4 shrink-0 bg-wa-gray-50 dark:bg-wa-gray-700 border-b border-wa-gray-200 dark:border-wa-gray-600">
        {/* Profile Picture */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <Avatar user={authUser} size="medium" />
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            className="hidden sm:flex p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => navigate("/")}
            title="Communities"
          >
            <Users className="size-5 text-wa-gray-500 dark:text-wa-gray-300" />
          </button>

          <button
            className="hidden sm:flex p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => navigate("/notifications")}
            title="Notifications"
          >
            <CircleDashed className="size-5 text-wa-gray-500 dark:text-wa-gray-300" />
          </button>

          <button
            className="flex p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => navigate("/notifications")}
            title="Status"
          >
            <CircleDashed className="size-5 text-wa-gray-500 dark:text-wa-gray-300 sm:hidden" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => navigate("/discover")}
            title="Discover People"
          >
            <Globe className="size-5 text-wa-gray-500 dark:text-wa-gray-300" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => navigate("/discover")}
            title="New Chat"
          >
            <MessageSquarePlus className="size-5 text-wa-gray-500 dark:text-wa-gray-300" />
          </button>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="size-5 text-wa-gray-500 dark:text-wa-gray-300" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[50] menu p-2 shadow-lg rounded-lg w-52 mt-4 bg-white dark:bg-wa-gray-700 text-wa-gray-800 dark:text-wa-gray-100"
            >
              <li>
                <ThemeSelector />
              </li>
              <li>
                <a
                  onClick={logoutMutation}
                  className="hover:bg-wa-gray-100 dark:hover:bg-wa-gray-600 rounded-md"
                >
                  <LogOutIcon className="size-4" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ChannelList
          filters={filters}
          sort={sort}
          showChannelSearch
          Preview={CustomChannelPreview}
          additionalChannelSearchProps={{
            searchForChannels: true,
            placeholder: "Search or start new chat",
          }}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
