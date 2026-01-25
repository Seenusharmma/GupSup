import { useState, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import toast from "react-hot-toast";
import { ArrowLeft, Camera, Trash2, Edit2, Check } from "lucide-react";
import { Link } from "react-router";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [name, setName] = useState(authUser?.fullName || "");
  const [about, setAbout] = useState(authUser?.bio || "");
  const [selectedImg, setSelectedImg] = useState(null);

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditingName(false);
      setIsEditingAbout(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImg(reader.result);
        // Auto upload when selecting new image, similar to WhatsApp logic
        updateProfileMutation({ profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (window.confirm("Remove profile photo?")) {
      setSelectedImg(null);
      updateProfileMutation({ profilePic: "" }); // Send empty string or logic to remove
    }
  };

  const handleNameSave = () => {
    if (name.trim().length === 0) return toast.error("Name cannot be empty");
    updateProfileMutation({ fullName: name });
  };

  const handleAboutSave = () => {
    updateProfileMutation({ bio: about });
  };

  return (
    <div className="h-full w-full bg-[#f0f2f5] dark:bg-[#111b21] flex flex-col">
      {/* Header */}
      <div className="h-16 bg-[#008069] dark:bg-[#202c33] flex items-center px-4 gap-4 text-white shrink-0">
        <Link to="/">
          <ArrowLeft className="w-6 h-6 cursor-pointer" />
        </Link>
        <h1 className="text-xl font-medium">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-0 pb-10">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center justify-center py-10 bg-[#f0f2f5] dark:bg-[#111b21]">
          <div className="relative group">
            <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-white dark:border-transparent relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {/* Overlay for hover effect */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center"
                >
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-xs uppercase font-medium tracking-wide">
                    Change
                  </span>
                </div>
                {(selectedImg || authUser?.profilePic) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto();
                    }}
                    className="p-2 bg-red-500/80 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto space-y-4 px-4 sm:px-0">
          {/* Name Card */}
          <div className="bg-white dark:bg-[#202c33] p-4 shadow-sm sm:rounded-md">
            <div className="flex justify-between items-end mb-4 text-[#008069] dark:text-[#00a884] text-sm font-medium">
              <span>Your Name</span>
            </div>

            {isEditingName ? (
              <div className="flex items-center gap-2 border-b-2 border-[#008069] pb-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#3b4a54] dark:text-[#e9edef] text-base"
                  autoFocus
                />
                <button onClick={handleNameSave} disabled={isPending}>
                  <Check className="w-5 h-5 text-[#8696a0] hover:text-[#008069] transition-colors" />
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center group">
                <p className="text-[#3b4a54] dark:text-[#e9edef] text-base">
                  {authUser?.fullName}
                </p>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-5 h-5 text-[#8696a0]" />
                </button>
              </div>
            )}

            <p className="mt-4 text-xs text-[#667781] dark:text-[#8696a0]">
              This is not your username or pin. This name will be visible to
              your WhatsApp contacts.
            </p>
          </div>

          {/* About Card */}
          <div className="bg-white dark:bg-[#202c33] p-4 shadow-sm sm:rounded-md">
            <div className="flex justify-between items-end mb-4 text-[#008069] dark:text-[#00a884] text-sm font-medium">
              <span>About</span>
            </div>

            {isEditingAbout ? (
              <div className="flex items-center gap-2 border-b-2 border-[#008069] pb-1">
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#3b4a54] dark:text-[#e9edef] text-base"
                  autoFocus
                />
                <button onClick={handleAboutSave} disabled={isPending}>
                  <Check className="w-5 h-5 text-[#8696a0] hover:text-[#008069] transition-colors" />
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center group">
                <p className="text-[#3b4a54] dark:text-[#e9edef] text-base">
                  {authUser?.bio || "Hey there! I am using GupSup."}
                </p>
                <button
                  onClick={() => setIsEditingAbout(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-5 h-5 text-[#8696a0]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
