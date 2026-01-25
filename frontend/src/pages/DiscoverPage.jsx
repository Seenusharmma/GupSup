import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
} from "../lib/api";
import {
  MapPinIcon,
  CheckCircleIcon,
  UserPlusIcon,
  ArrowLeft,
} from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import { Link } from "react-router";
import Avatar from "../components/Avatar";

const DiscoverPage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="flex flex-col h-full w-full bg-wa-gray-50 dark:bg-wa-gray-800">
      {/* Header */}
      <div className="h-[60px] flex items-center px-4 shrink-0 bg-wa-green text-white shadow-sm">
        <Link
          to="/"
          className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors lg:hidden"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Discover People</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-white dark:bg-wa-gray-700 rounded-lg shadow-wa overflow-hidden">
            <div className="p-4 border-b border-wa-gray-100 dark:border-wa-gray-600 bg-wa-gray-50 dark:bg-wa-gray-700">
              <h2 className="text-sm font-bold text-wa-green uppercase tracking-wide">
                Recommended for you
              </h2>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center p-8">
                <span className="loading loading-spinner text-wa-green"></span>
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="p-8 text-center text-wa-gray-500 dark:text-wa-gray-400">
                No new recommendations available.
              </div>
            ) : (
              <div className="divide-y divide-wa-gray-100 dark:divide-wa-gray-600">
                {recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-wa-gray-50 dark:hover:bg-wa-gray-600 transition-colors cursor-pointer"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <Avatar user={user} size="large" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1 gap-2">
                          <h3 className="text-wa-gray-800 dark:text-wa-gray-100 font-semibold truncate flex-1">
                            {user.fullName}
                          </h3>
                          <span className="text-xs text-wa-gray-400 flex items-center gap-1 shrink-0">
                            {user.location && (
                              <>
                                <MapPinIcon className="w-3 h-3" />{" "}
                                <span className="hidden sm:inline">
                                  {user.location}
                                </span>
                              </>
                            )}
                          </span>
                        </div>

                        <p className="text-sm text-wa-gray-500 dark:text-wa-gray-400 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="flex items-center gap-1 text-xs bg-wa-gray-100 dark:bg-wa-gray-600 px-1.5 py-0.5 rounded shrink-0">
                            {getLanguageFlag(user.nativeLanguage)}{" "}
                            <span className="hidden xs:inline">
                              {capitialize(user.nativeLanguage)}
                            </span>
                          </span>
                          <span className="text-wa-gray-400 hidden xs:inline">
                            →
                          </span>
                          <span className="flex items-center gap-1 text-xs bg-wa-gray-100 dark:bg-wa-gray-600 px-1.5 py-0.5 rounded shrink-0">
                            {getLanguageFlag(user.learningLanguage)}{" "}
                            <span className="hidden xs:inline">
                              {capitialize(user.learningLanguage)}
                            </span>
                          </span>
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                        className={`p-2 rounded-full transition-colors shrink-0 ${
                          hasRequestBeenSent
                            ? "text-wa-gray-400 bg-wa-gray-100 dark:bg-wa-gray-600"
                            : "text-wa-green hover:bg-wa-green/10"
                        }`}
                      >
                        {hasRequestBeenSent ? (
                          <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <UserPlusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
