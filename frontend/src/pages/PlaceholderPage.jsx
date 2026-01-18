import React from "react";
import { Hammer } from "lucide-react";

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#f0f2f5] dark:bg-[#111b21] text-center p-6">
      <div className="bg-gray-200 dark:bg-[#1f2c34] p-6 rounded-full mb-6">
        <Hammer className="w-12 h-12 text-[#00a884]" />
      </div>
      <h2 className="text-2xl font-bold text-[#111b21] dark:text-[#e9edef] mb-2">
        {title}
      </h2>
      <p className="text-[#8696a0] max-w-xs">
        This feature is currently under development. Stay tuned for updates!
      </p>
    </div>
  );
};

export default PlaceholderPage;
