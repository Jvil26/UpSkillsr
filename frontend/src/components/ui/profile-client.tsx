"use client";
import { useEffect, useState } from "react";
import { useFetchSkills } from "@/hooks/skills";
import { useFetchUser } from "@/hooks/users";
import SkillSelector from "./skills-selector";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { formatPhoneNumber } from "@/lib/utils";
import { toast } from "sonner";
import { useUpdateUserProfile, useUpdateUserSkills } from "@/hooks/users";
import { Skills, UserSkillsPayload } from "@/lib/types";
import { UserProfileSkeleton } from "./user-profile-skeleton";

export default function ProfileClient({ username }: { username: string }) {
  const { data: user, isFetching: isFetchingUser, isError: isErrorUser } = useFetchUser(username);
  const { data: allSkills, isFetching: isFetchingSkills, isError: isErrorSkills } = useFetchSkills();
  const { mutateAsync: updateUserSkills } = useUpdateUserSkills();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfile();
  const [offeredSkills, setOfferedSkills] = useState<Skills>([]);
  const [wantedSkills, setWantedSkills] = useState<Skills>([]);
  const [bio, setBio] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const isFetching = isFetchingUser || isFetchingSkills;

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      if (username && user?.profile) {
        await updateUserProfile({
          username: username,
          updatedProfile: {
            ...user?.profile,
            bio: bio,
          },
        });
      }
      const userSkills: UserSkillsPayload = [];
      if (offeredSkills) {
        for (const skill of offeredSkills) {
          userSkills.push({ skill: skill, skillType: "Offered", proficiency: "pro" });
        }
      }
      if (wantedSkills) {
        for (const skill of wantedSkills) {
          userSkills.push({ skill: skill, skillType: "Wanted", proficiency: "noob" });
        }
      }
      console.log({ username: username, userSkills: userSkills });
      await updateUserSkills({ username: username, userSkills: userSkills });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      setOfferedSkills(
        user.user_skills
          .filter((userSkill) => userSkill.skill_type === "Offered")
          .map((userSkill) => userSkill.skill) || []
      );
      setWantedSkills(
        user.user_skills.filter((userSkill) => userSkill.skill_type === "Wanted").map((userSkill) => userSkill.skill) ||
          []
      );
      setBio(user.profile.bio);
      console.log(user);
    }
  }, [user]);

  useEffect(() => {
    if (isErrorSkills) {
      toast.error("Failed to fetch all skills.");
    } else if (isErrorUser) {
      toast.error(`Failed to fetch user profile.`);
    }
  }, [isErrorSkills, isErrorUser]);

  if (isFetching) {
    console.log(isFetchingUser);
    return <UserProfileSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-y-5">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">{user?.username}</h1>
        <Avatar className="w-6/10 h-6/10 mt-2">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Name: {user?.name}</h3>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Email: {user?.email}</h3>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Phone: {user?.profile.phone ? formatPhoneNumber(user?.profile.phone) : ""}
        </h3>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Gender: {user?.profile.gender}</h3>
      </div>
      <div className="space-y-8 w-100">
        <SkillSelector
          label="Skills I Can Teach"
          allSkills={allSkills}
          selected={offeredSkills}
          setSelected={setOfferedSkills}
        />
        <SkillSelector
          label="Skills I Want to Learn"
          allSkills={allSkills}
          selected={wantedSkills}
          setSelected={setWantedSkills}
        />
        <div className="grid w-full gap-1">
          <Label htmlFor="bio" className="font-semibold text-base">
            Bio
          </Label>
          <Textarea
            placeholder="Type your bio. Specify your skills and what you want to learn."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            id="bio"
            className="h-30"
          />
          <p className="text-muted-foreground text-sm">Your bio helps you find better matches.</p>
        </div>
        <Button onClick={() => handleSaveProfile()} disabled={isSaving}>
          Save Profile
        </Button>
      </div>
    </>
  );
}
