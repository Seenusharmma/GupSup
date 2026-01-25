import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  useChatContext,
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";
import {
  Video,
  MoreVertical,
  Search,
  ArrowLeft,
  Smile,
  Paperclip,
  Send,
  X,
} from "lucide-react";

import ChatLoader from "../components/ChatLoader";
import CustomMessage from "../components/CustomMessage";
import CustomMessageInput from "../components/CustomMessageInput";
import Avatar from "../components/Avatar";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { client } = useChatContext();
  const { authUser } = useAuthUser();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [quotedMessage, setQuotedMessage] = useState(null);

  useEffect(() => {
    const loadChannel = async () => {
      if (!client || !authUser || !targetUserId) return;

      setLoading(true);

      try {
        const channelId = [authUser._id, targetUserId].sort().join("-");

        const newChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await newChannel.watch();
        setChannel(newChannel);

        const members = Object.values(newChannel.state.members || {});
        const other = members.find((m) => m.user?.id !== authUser._id);
        setOtherUser(other?.user);
      } catch (error) {
        console.error("Error creating channel:", error);
        toast.error("Could not open chat");
      } finally {
        setLoading(false);
      }
    };

    loadChannel();
  }, [client, authUser, targetUserId]);

  const navigate = useNavigate();

  const handleVideoCall = () => {
    if (channel) {
      const callId = channel.id;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        navigate(`/call/${callId}`);
      } else {
        const callUrl = `${window.location.origin}/call/${callId}`;
        // Open popup window
        window.open(
          callUrl,
          "Video Call",
          "height=600,width=800,scrollbars=no,status=no,resizable=yes",
        );
      }

      // Still send message
      channel.sendMessage({
        text: `📞 Video call started. Join here: ${window.location.origin}/call/${callId}`,
      });
      // toast.success("Video call started!");
    }
  };

  if (loading || !channel) return <ChatLoader />;

  return (
    <div className="h-full w-full flex flex-col bg-[#EFEAE2]">
      <Channel
        channel={channel}
        Message={(props) => (
          <CustomMessage {...props} setQuotedMessage={setQuotedMessage} />
        )}
      >
        <div className="w-full h-full relative flex flex-col">
          {/* Header */}
          <div className="h-14 sm:h-16 flex items-center px-2 sm:px-3 md:px-4 shrink-0 z-20 bg-[#f0f2f5] border-b border-[#d1d7db] shadow-sm justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0">
              <Link to="/" className="md:hidden shrink-0">
                <div className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition-colors active:scale-95 duration-200">
                  <ArrowLeft className="w-5 h-5 text-[#54656f]" />
                </div>
              </Link>

              {/* User Avatar */}
              <div className="relative cursor-pointer transition-transform duration-200 hover:scale-105 shrink-0">
                <Avatar user={otherUser} size="medium" />
                {otherUser?.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#f0f2f5]"></span>
                )}
              </div>

              <div className="flex flex-col cursor-pointer min-w-0 flex-1">
                <h2 className="font-semibold text-[#111b21] leading-tight text-sm md:text-base truncate">
                  {otherUser?.name || "User"}
                </h2>
                <p className="text-[11px] md:text-xs text-[#667781] leading-none truncate">
                  {otherUser?.online ? "Online" : "Click for info"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
              <button
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-95"
                onClick={handleVideoCall}
                title="Video call"
              >
                <Video className="w-5 h-5 md:w-6 md:h-6 text-[#54656f]" />
              </button>
              <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-95 hidden sm:block">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-[#54656f]" />
              </button>
              <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-95">
                <MoreVertical className="w-5 h-5 md:w-6 md:h-6 text-[#54656f]" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto relative custom-scrollbar"
            style={{
              backgroundColor: "#efeae2",
              backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
              backgroundBlendMode: "overlay",
            }}
          >
            <Window hideOnThread>
              <MessageList />
            </Window>
          </div>

          {/* Input Area */}
          <div className="shrink-0 z-20 bg-[#f0f2f5]">
            {/* Quoted Message Preview */}
            {quotedMessage && (
              <div className="pt-2 px-2 mx-2 mt-2 bg-[#d9fdd3] dark:bg-wa-green-dark border-l-4 border-wa-green rounded-md flex justify-between items-center shadow-sm">
                <div className="overflow-hidden p-1">
                  <p className="text-xs font-bold text-wa-teal dark:text-wa-green mb-0.5">
                    {quotedMessage.user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[300px]">
                    {quotedMessage.text}
                  </p>
                </div>
                <button
                  onClick={() => setQuotedMessage(null)}
                  className="p-1 hover:bg-black/10 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}

            <MessageInput
              minRows={1}
              overrideSubmitHandler={async (message) => {
                try {
                  const messageData = {
                    text: message.text,
                    attachments: message.attachments,
                    quoted_message_id: quotedMessage?.id,
                  };

                  if (quotedMessage) {
                    messageData.parent_id = quotedMessage.id;
                    messageData.show_in_channel = true;
                  }

                  await channel.sendMessage(messageData);
                  setQuotedMessage(null);
                } catch (err) {
                  console.error(err);
                }
              }}
              Input={CustomMessageInput}
            />
          </div>

          <Thread />
        </div>
      </Channel>
    </div>
  );
};

export default ChatPage;
