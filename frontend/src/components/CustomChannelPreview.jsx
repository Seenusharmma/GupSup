import { useChatContext } from "stream-chat-react";
import { useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";

const CustomChannelPreview = ({ channel, setActiveChannel }) => {
    const navigate = useNavigate();
    const { authUser } = useAuthUser();

    // Get the other member in the channel
    const members = Object.values(channel.state.members || {});
    const otherMember = members.find((m) => m.user?.id !== authUser?._id);
    
    // Get last message info
    const lastMessage = channel.state.messages?.[channel.state.messages.length - 1];
    const lastMessageText = lastMessage?.text || "No messages yet";
    const lastMessageTime = lastMessage?.created_at 
        ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "";

    // Unread count
    const unreadCount = channel.countUnread();

    const handleClick = () => {
        setActiveChannel?.(channel);
        if (otherMember?.user?.id) {
            navigate(`/chat/${otherMember.user.id}`);
        }
    };

    if (!otherMember) return null;

    return (
        <div 
            onClick={handleClick}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-wa-gray-50 dark:hover:bg-wa-gray-700 transition-colors border-b border-wa-gray-100 dark:border-wa-gray-600 bg-white dark:bg-wa-gray-800"
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                <img 
                    src={otherMember.user?.image || "/avatar.png"} 
                    alt={otherMember.user?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                />
                {/* Online indicator */}
                {otherMember.user?.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-wa-green rounded-full border-2 border-white dark:border-wa-gray-800"></span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate text-wa-gray-800 dark:text-wa-gray-100">
                        {otherMember.user?.name || "Unknown User"}
                    </h3>
                    <span className={`text-xs shrink-0 ml-2 ${unreadCount > 0 ? 'text-wa-green' : 'text-wa-gray-400'}`}>
                        {lastMessageTime}
                    </span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                    <p className="text-sm truncate text-wa-gray-500 dark:text-wa-gray-400">
                        {lastMessageText.length > 40 ? lastMessageText.substring(0, 40) + "..." : lastMessageText}
                    </p>
                    {unreadCount > 0 && (
                        <span className="ml-2 min-w-[20px] h-5 flex items-center justify-center text-xs font-semibold rounded-full px-1.5 bg-wa-green text-white">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomChannelPreview;
