"use client";
import { useEffect, useState } from "react";
import { useFetchUser } from "@/hooks/users";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { formatPhoneNumber } from "@/lib/utils";
import { toast } from "sonner";
import { useUpdateUserProfileById, useUpdateUserProfilePic } from "@/hooks/users";
import { UserProfileSkeleton } from "./user-profile-skeleton";

export default function ProfileView() {
  const { data: user, isFetching: isFetchingUser, isError: isErrorUser } = useFetchUser();
  const { mutateAsync: updateUserProfileById, isPending: isSavingProfile } = useUpdateUserProfileById();
  const { mutateAsync: updateUserProfilePic } = useUpdateUserProfilePic();
  //const [userSkills, setUserSkills] = useState<Skills>([]);
  const [bio, setBio] = useState<string>("");

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file && user) {
        await updateUserProfilePic({ file: file, userProfileId: user?.profile.id });
        toast.success("Successfully updated profile picture!");
      }
    } catch {
      toast.error("Error uploading image. Try again.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (user && user?.profile) {
        await updateUserProfileById({
          id: user.profile.id,
          updatedProfile: {
            id: user.profile.id,
            phone: user.profile.phone,
            user_id: user.profile.user_id,
            gender: user.profile.gender,
            bio: bio,
          },
        });
        toast.success("Successfully saved profile!");
      }
    } catch {
      toast.error("Error saving profile. Try again.");
    }
  };

  useEffect(() => {
    if (user) {
      setBio(user.profile.bio);
    }
  }, [user]);

  useEffect(() => {
    if (isErrorUser) {
      toast.error(`Failed to fetch user profile.`);
    }
  }, [isErrorUser]);

  if (isFetchingUser) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className="flex justify-evenly items-center p-8 min-h-screen overflow-y-auto sm:flex-row flex-col pt-[calc(var(--nav-height))]">
      <div className="flex flex-col justify-center items-center gap-y-5 mb-5 w-full">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">{user?.username}</h1>
        <Label htmlFor="avatar" className="cursor-pointer justify-center flex-col items-center mb-5">
          <Avatar className="w-6/10 h-6/10 mt-2 hover:opacity-50">
            <AvatarImage src={user?.profile.profile_pic || "https://github.com/shadcn.png"} />
            <AvatarFallback>Profile Image</AvatarFallback>
          </Avatar>
          <span>Upload New Profile Image</span>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarUpload(e)}
          />
        </Label>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Name: {user?.name}</h3>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Email: {user?.email}</h3>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Phone: {user?.profile.phone ? formatPhoneNumber(user?.profile.phone) : ""}
        </h3>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Gender: {user?.profile.gender}</h3>
      </div>
      <div className="space-y-8 w-9/10">
        <div className="grid w-full gap-1">
          <Label htmlFor="bio" className="font-semibold text-[1.1rem]">
            Bio
          </Label>
          <Textarea
            placeholder="Type your bio. Specify your skills and what you want to learn."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            id="bio"
            className="min-h-45 resize-none h-fit !text-[1rem] w-full md:w-8/10"
          />
          <p className="text-muted-foreground text-sm">Your bio helps you find better matches.</p>
        </div>
        <Button onClick={() => handleSaveProfile()} disabled={isSavingProfile}>
          {isSavingProfile ? "Saving Profile..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
