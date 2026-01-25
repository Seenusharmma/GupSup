import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MessageCircle } from "lucide-react";
import Avatar from "./Avatar";

const FriendCard = ({ friend }) => {
  return (
    <div
      className="rounded-lg wa-transition hover:shadow-wa-chat overflow-hidden cursor-pointer"
      style={{
        backgroundColor: "var(--wa-bg-primary)",
        border: "1px solid var(--wa-border)",
      }}
    >
      <div className="p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="avatar relative">
            <div className="size-12 sm:size-14 rounded-full overflow-hidden flex items-center justify-center">
              <Avatar user={friend} size="large" />
            </div>
            {/* Online indicator (optional - can be connected to real status) */}
            <div
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
              style={{
                backgroundColor: "#25d366",
                borderColor: "var(--wa-bg-primary)",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold truncate text-base"
              style={{ color: "var(--wa-text-primary)" }}
            >
              {friend.fullName}
            </h3>
            <p
              className="text-xs truncate"
              style={{ color: "var(--wa-text-tertiary)" }}
            >
              Click to start chatting
            </p>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: "var(--wa-teal)",
              color: "white",
            }}
          >
            {getLanguageFlag(friend.nativeLanguage)}
            {friend.nativeLanguage}
          </span>
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: "transparent",
              border: "1px solid var(--wa-border)",
              color: "var(--wa-text-secondary)",
            }}
          >
            {getLanguageFlag(friend.learningLanguage)}
            {friend.learningLanguage}
          </span>
        </div>

        {/* Message Button */}
        <Link
          to={`/chat/${friend._id}`}
          className="btn w-full wa-transition flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--wa-teal)",
            color: "white",
            border: "none",
          }}
        >
          <MessageCircle className="size-4" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
