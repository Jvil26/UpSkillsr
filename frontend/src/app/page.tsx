"use client";

import KanbanBoard from "@/components/kanban/kanban-board";
import { useFetchUserSkills } from "@/hooks/users";
import { useFetchAllSkills } from "@/hooks/skills";
import { Loader2 } from "lucide-react";

export default function Home() {
  const {
    data: userSkills,
    isFetching: isFetchingUserSkills,
    isError: isErrorFetchingUserSkills,
  } = useFetchUserSkills();
  const { data: allSkills, isFetching: isFetchingAllSkills, isError: isErrorFetchingAllSkills } = useFetchAllSkills();

  if (isFetchingUserSkills || isFetchingAllSkills) {
    return (
      <div className="min-h-screen pt-[calc(var(--nav-height))] flex items-center justify-center p-1 sm:pl-10 sm:pr-7 sm:pb-10">
        <Loader2 className="w-15 h-15 animate-spin" />
      </div>
    );
  }

  if (isErrorFetchingAllSkills || isErrorFetchingUserSkills) {
    return (
      <div className="min-h-screen pt-[calc(var(--nav-height))] flex justify-center items-center p-1 sm:pl-10 sm:pr-7 sm:pb-10">
        <h1 className="text-[2rem] font-bold">Error fetching from server. Try Again.</h1>
      </div>
    );
  }

  const availableSkills = allSkills?.filter((skill) => !userSkills?.some((us) => us.skill.id === skill.id)) ?? [];

  return <KanbanBoard userSkills={userSkills ?? []} availableSkills={availableSkills} />;
}
