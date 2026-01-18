import React, { useState } from 'react';

const Avatar = ({ user, size = "medium" }) => {
    const [imgError, setImgError] = useState(false);

    // Sizes
    const sizeClasses = {
        small: "w-9 h-9 md:w-10 md:h-10 text-sm",
        medium: "w-10 h-10 text-base",
        large: "w-12 h-12 text-lg",
        xl: "w-16 h-16 text-xl",
        "2xl": "w-32 h-32 text-4xl",
    };

    const containerSize = sizeClasses[size] || sizeClasses.medium;

    // Helper to get initials
    const getInitials = (name) => {
        if (!name) return "?";
        return name.charAt(0).toUpperCase();
    };

    // Helper to get deterministic color based on name/id
    const getColor = (str) => {
        const colors = [
            "bg-red-500", "bg-orange-500", "bg-amber-500", 
            "bg-green-500", "bg-emerald-500", "bg-teal-500",
            "bg-cyan-500", "bg-sky-500", "bg-blue-500",
            "bg-indigo-500", "bg-violet-500", "bg-purple-500",
            "bg-fuchsia-500", "bg-pink-500", "bg-rose-500"
        ];
        
        if (!str) return colors[0];
        
        // Simple hash
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const index = Math.abs(hash % colors.length);
        return colors[index];
    };

    const hasImage = (user?.profilePic || user?.image) && !imgError;

    if (hasImage) {
        return (
            <div className={`${containerSize} rounded-full overflow-hidden border border-gray-200 dark:border-gray-700`}>
                <img 
                    src={user?.profilePic || user?.image} 
                    alt={user?.fullName || user?.name || "User"} 
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    return (
        <div 
            className={`${containerSize} rounded-full flex items-center justify-center text-white font-bold shadow-sm ${getColor(user?._id || user?.id || user?.fullName || user?.name)}`}
            title={user?.fullName || user?.name || "User"}
        >
            {getInitials(user?.fullName || user?.name)}
        </div>
    );
};

export default Avatar;
