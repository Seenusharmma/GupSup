import { useMessageContext, useChatContext, useChannelStateContext } from "stream-chat-react";
import { useState } from "react";
import { Smile, Reply, Trash2, Copy, MoreHorizontal, Check, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

const CustomMessage = ({ setQuotedMessage }) => {
    // Extract contexts
    const { message, isMyMessage, handleDelete, handleReaction } = useMessageContext();
    const { channel } = useChannelStateContext();
    const { client } = useChatContext();
    
    // State
    const [showMenu, setShowMenu] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    
    const isMine = isMyMessage();
    const time = message.created_at 
        ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "";

    const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

    // --- Message Status Logic ---
    const getMessageStatus = () => {
        if (message.status === 'sending') return 'sending';
        
        const readByOthers = message.readBy?.filter(u => u.id !== client.user.id).length > 0;
        if (readByOthers) return 'read';
        
        const members = Object.values(channel.state.members || {});
        const otherMember = members.find(m => m.user?.id !== client.user.id);
        
        if (otherMember?.user?.online) return 'delivered';
        
        return 'sent';
    };

    const status = getMessageStatus();

    // ACTIONS
    const onReply = () => {
        if (setQuotedMessage) setQuotedMessage(message);
        setShowMenu(false);
    };

    const onDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm("Delete this message?")) {
            try {
                await client.deleteMessage(message.id);
            } catch (err) {
                console.error("Error deleting message:", err);
                toast.error("Failed to delete message");
            }
        }
        setShowMenu(false);
    };

    const onCopy = () => {
        navigator.clipboard.writeText(message.text || "");
        toast.success("Copied!");
        setShowMenu(false);
    };

    const onReactionClick = async (emoji) => {
        const emojiMap = { "👍": "thumbs_up", "❤️": "love", "😂": "haha", "😮": "wow", "😢": "sad", "🙏": "pray" };
        const type = emojiMap[emoji];
        
        try {
             // Check if already reacted
             const currReactions = message.latest_reactions || []; 
             const ownReactions = message.own_reactions || [];
             const hasReacted = ownReactions.some(r => r.type === type);

             if (hasReacted) {
                 await client.channel(channel.type, channel.id).deleteReaction(message.id, type);
             } else {
                 await client.channel(channel.type, channel.id).sendReaction(message.id, { type });
             }
        } catch (error) { 
            console.error("Reaction error:", error);
        }
        setShowReactions(false);
        setShowMenu(false);
    };

    if (message.deleted_at) {
        return (
            <div className={`flex w-full mb-2 px-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className="px-3 py-2 rounded-lg bg-wa-gray-100 dark:bg-wa-gray-700 italic text-wa-gray-400 text-sm flex items-center gap-2">
                    <Trash2 className="w-3 h-3" /> This message was deleted
                </div>
            </div>
        );
    }

    const isReply = !!message.parent_id;
    const quotedMsg = message.quoted_message || message.parent_shared_message;

    return (
        <div 
            className={`flex w-full mb-1 px-4 group relative ${isMine ? 'justify-end' : 'justify-start'}`}
            onMouseLeave={() => { setShowMenu(false); setShowReactions(false); }}
        >
            {/* Menu Trigger */}
            <button
                className={`
                    absolute top-0 right-0 m-1 w-6 h-6 rounded-full bg-black/10 hover:bg-black/20 text-gray-500
                    flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20
                    ${showMenu ? 'opacity-100' : ''}
                `}
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            >
                <MoreHorizontal className="w-4 h-4 text-wa-gray-600 dark:text-wa-gray-300" />
            </button>

            {/* Menu Dropdown */}
            {showMenu && (
                <div className="absolute top-8 right-0 bg-white dark:bg-wa-gray-700 shadow-xl rounded-lg py-1 w-40 z-30 border border-wa-gray-100 dark:border-wa-gray-600">
                    <button onClick={onReply} className="w-full text-left px-4 py-2 hover:bg-wa-gray-50 dark:hover:bg-wa-gray-600 flex items-center gap-2 text-sm text-wa-gray-800 dark:text-white">
                        <Reply className="w-4 h-4" /> Reply
                    </button>
                    <button onClick={onCopy} className="w-full text-left px-4 py-2 hover:bg-wa-gray-50 dark:hover:bg-wa-gray-600 flex items-center gap-2 text-sm text-wa-gray-800 dark:text-white">
                        <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setShowReactions(!showReactions); }} className="w-full text-left px-4 py-2 hover:bg-wa-gray-50 dark:hover:bg-wa-gray-600 flex items-center gap-2 text-sm text-wa-gray-800 dark:text-white">
                        <Smile className="w-4 h-4" /> React
                    </button>
                    {isMine && (
                        <button onClick={onDelete} className="w-full text-left px-4 py-2 hover:bg-wa-gray-50 dark:hover:bg-wa-gray-600 flex items-center gap-2 text-sm text-red-500">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    )}
                </div>
            )}

            {/* Reactions Picker */}
            {showReactions && (
                <div className="absolute top-10 right-0 bg-white dark:bg-wa-gray-700 shadow-xl rounded-full p-1 z-30 flex items-center gap-1">
                    {reactionEmojis.map((emoji) => (
                        <button key={emoji} onClick={() => onReactionClick(emoji)} className="p-1.5 hover:bg-wa-gray-100 dark:hover:bg-wa-gray-600 rounded-full text-lg transition-transform hover:scale-125">
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Message Bubble */}
            <div className={`relative max-w-[70%] min-w-[80px] group`}>
                <div className={`px-3 py-2 rounded-xl text-left transform transition-all duration-200 ${
                    isMine 
                        ? 'bg-gradient-to-br from-wa-green-light to-[#c8f7c5] dark:from-wa-green-dark dark:to-[#004d40] rounded-tr-sm' 
                        : 'bg-white dark:bg-wa-gray-700 rounded-tl-sm shadow-sm'
                }`}>
                    {/* Tail */}
                    <div className={`absolute top-0 w-3 h-3 ${isMine ? 'right-[-6px] bg-wa-green-light dark:bg-wa-green-dark' : 'left-[-6px] bg-white dark:bg-wa-gray-700'}`} style={{ clipPath: isMine ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)' }} />
                    
                    {!isMine && message.user && <p className="text-xs font-semibold text-wa-teal dark:text-wa-green mb-1">{message.user.name}</p>}

                    {/* Quoted Message */}
                    {quotedMsg && (
                        <div className={`mb-1 p-2 rounded-md border-l-4 border-wa-green bg-black/5 dark:bg-white/5`}>
                           <p className="font-bold text-xs text-wa-green">{quotedMsg.user?.name || "User"}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-300 truncate">{quotedMsg.text}</p>
                        </div>
                    )}
                    
                    {/* Message Text */}
                    <p className={`text-[15px] leading-relaxed break-words whitespace-pre-wrap ${isMine ? 'text-wa-gray-800 dark:text-white' : 'text-wa-gray-800 dark:text-wa-gray-100'}`}>
                        {message.text ? message.text.split(/(https?:\/\/[^\s]+)/g).map((part, index) => part.match(/https?:\/\/[^\s]+/) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer" className={`underline hover:opacity-80 break-all ${isMine ? 'text-blue-600 dark:text-blue-300' : 'text-blue-600 dark:text-blue-400'}`} onClick={(e) => e.stopPropagation()}>{part}</a> : part) : ""}
                    </p>
                    
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                             {message.attachments.map((attachment, index) => (
                                <img key={index} src={attachment.image_url || attachment.thumb_url} alt="attachment" className="rounded-lg max-w-full" />
                             ))}
                        </div>
                    )}

                    {/* Reactions Display */}
                    {message.latest_reactions && message.latest_reactions.length > 0 && (
                         <div className={`absolute -bottom-2 ${isMine ? 'left-0' : 'right-0'} bg-white dark:bg-wa-gray-700 rounded-full px-1.5 py-0.5 shadow border border-gray-100 flex items-center gap-0.5 scale-90`}>
                             {message.latest_reactions.slice(0, 3).map((r, i) => {
                                 const typeToEmoji = { "thumbs_up": "👍", "love": "❤️", "haha": "😂", "wow": "😮", "sad": "😢", "pray": "🙏" };
                                 return <span key={i} className="text-xs">{typeToEmoji[r.type] || r.type}</span>
                             })}
                             <span className="text-[10px] text-gray-500 ml-0.5">{message.latest_reactions.length}</span>
                        </div>
                    )}

                    {/* Meta: Time + Status Ticks */}
                    <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[11px] ${isMine ? 'text-wa-gray-500 dark:text-wa-gray-300' : 'text-wa-gray-400'}`}>{time}</span>
                        {isMine && status !== 'sending' && (
                            <span className={`className="ml-0.5`}>
                                {status === 'read' ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                ) : status === 'delivered' ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                ) : (
                                    <Check className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                )}
                            </span>
                        )}
                        {isMine && status === 'sending' && <span className="text-gray-400 text-xs text-[10px]">🕒</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomMessage;
