import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { Link } from "react-router";
import Avatar from "../components/Avatar";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div
      className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen"
      style={{ backgroundColor: "var(--wa-bg-secondary)" }}
    >
      <div className="container mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-black/5 transition-colors md:hidden"
          >
            <ArrowLeft
              className="w-5 h-5"
              style={{ color: "var(--wa-icon)" }}
            />
          </Link>
          <div>
            <h1
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{ color: "var(--wa-text-primary)" }}
            >
              Notifications
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--wa-text-secondary)" }}
            >
              Manage your friend requests and connections
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span
              className="loading loading-spinner loading-lg"
              style={{ color: "var(--wa-teal)" }}
            />
          </div>
        ) : (
          <>
            {/* Incoming Friend Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2
                  className="text-xl font-semibold flex items-center gap-2"
                  style={{ color: "var(--wa-text-primary)" }}
                >
                  <UserCheckIcon
                    className="h-5 w-5"
                    style={{ color: "var(--wa-teal)" }}
                  />
                  Friend Requests
                  <span
                    className="badge ml-2 text-xs px-2 py-1"
                    style={{
                      backgroundColor: "var(--wa-teal)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="rounded-lg wa-transition hover:shadow-wa-chat"
                      style={{
                        backgroundColor: "var(--wa-bg-primary)",
                        border: "1px solid var(--wa-border)",
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="avatar shrink-0">
                              <Avatar user={request.sender} size="large" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-semibold truncate"
                                style={{ color: "var(--wa-text-primary)" }}
                              >
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: "var(--wa-teal)",
                                    color: "white",
                                  }}
                                >
                                  {request.sender.nativeLanguage}
                                </span>
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "1px solid var(--wa-border)",
                                    color: "var(--wa-text-secondary)",
                                  }}
                                >
                                  Learning {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-sm wa-transition shrink-0"
                            style={{
                              backgroundColor: "var(--wa-teal)",
                              color: "white",
                              border: "none",
                            }}
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            <CheckCircle className="size-3.5 sm:size-4 mr-1" />
                            <span className="hidden xs:inline">Accept</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Requests Notifications */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2
                  className="text-xl font-semibold flex items-center gap-2"
                  style={{ color: "var(--wa-text-primary)" }}
                >
                  <BellIcon
                    className="h-5 w-5"
                    style={{ color: "var(--wa-teal)" }}
                  />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="rounded-lg"
                      style={{
                        backgroundColor: "var(--wa-bg-primary)",
                        border: "1px solid var(--wa-border)",
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1">
                            <Avatar
                              user={notification.recipient}
                              size="medium"
                            />
                          </div>
                          <div className="flex-1">
                            <h3
                              className="font-semibold"
                              style={{ color: "var(--wa-text-primary)" }}
                            >
                              {notification.recipient.fullName}
                            </h3>
                            <p
                              className="text-sm my-1"
                              style={{ color: "var(--wa-text-secondary)" }}
                            >
                              Accepted your friend request
                            </p>
                            <p
                              className="text-xs flex items-center"
                              style={{ color: "var(--wa-text-tertiary)" }}
                            >
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div
                            className="badge text-xs px-2 py-1"
                            style={{
                              backgroundColor: "#25d366",
                              color: "white",
                              border: "none",
                            }}
                          >
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            Connected
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
