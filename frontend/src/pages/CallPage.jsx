import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const clientRef = useRef(null);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser || !callId) return;

    // Prevent double initialization
    if (clientRef.current) return;

    const initCall = async () => {
      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic?.startsWith("data:")
            ? undefined
            : authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        clientRef.current = videoClient;
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      }
    };

    initCall();

    return () => {
      if (clientRef.current) {
        console.log("Cleaning up Stream client...");
        clientRef.current.disconnectUser();
        clientRef.current = null;
        setClient(null);
        setCall(null);
      }
    };
  }, [tokenData, authUser, callId]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#0b141a]">
      <div className="relative w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/80 animate-pulse">
                Connecting to secure call...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  if (callingState === CallingState.LEFT) {
    if (window.opener) {
      window.close();
    } else {
      return navigate("/");
    }
    return null;
  }

  return (
    <StreamTheme className="h-full w-full custom-call-theme">
      <div className="relative h-full w-full bg-[#0b141a]">
        {" "}
        {/* WhatsApp Dark Bkg */}
        {/* Main Video Area */}
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <SpeakerLayout participantsBarPosition="bottom" />
        </div>
        {/* Floating Controls */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
          <div className="pointer-events-auto bg-[#1f2c34] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-2xl border border-gray-700/50 flex gap-1 sm:gap-2 backdrop-blur-md overflow-x-auto max-w-full custom-scrollbar-hidden">
            <CallControls />
          </div>
        </div>
        {/* Mobile Back Button */}
        {isMobile && (
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-50 p-2 bg-black/40 text-white rounded-full backdrop-blur-sm"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
    </StreamTheme>
  );
};

export default CallPage;
