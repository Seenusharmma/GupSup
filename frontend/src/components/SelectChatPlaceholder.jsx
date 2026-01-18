import { MessageCircle, Lock } from "lucide-react";

const SelectChatPlaceholder = () => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center h-full w-full bg-wa-gray-50 dark:bg-wa-gray-900">
      <div className="text-center space-y-8 max-w-md px-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-48 h-48 rounded-full flex items-center justify-center bg-white dark:bg-wa-gray-800 border-8 border-wa-gray-100 dark:border-wa-gray-700">
              <MessageCircle className="size-24 text-wa-green" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-4xl font-light text-wa-gray-500 dark:text-wa-gray-300">
            GupSup Web
          </h2>
          <p className="text-sm leading-relaxed text-wa-gray-400">
            Send and receive messages without keeping your phone online.
            <br />
            Select a chat to start messaging.
          </p>
        </div>

        {/* Security */}
        <div className="pt-8 space-y-4 text-sm text-wa-gray-400">
          <div className="flex items-center justify-center gap-3">
            <Lock className="size-4" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectChatPlaceholder;
