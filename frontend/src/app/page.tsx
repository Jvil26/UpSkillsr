"use client";
import KanbanBoard from "@/components/ui/kanban-board";
import { useFetchUserSkills } from "@/hooks/users";
import { useFetchAllSkills } from "@/hooks/skills";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: userSkills, isLoading: isLoadingUserSkills } = useFetchUserSkills();
  const { data: allSkills, isLoading: isLoadingAllSkills } = useFetchAllSkills();

  const isLoading = isLoadingUserSkills || isLoadingAllSkills;

  if (isLoading) return <Loader2 />;

  const availableSkills = allSkills?.filter((skill) => !userSkills?.some((us) => us.skill.id === skill.id)) ?? [];

  return <KanbanBoard userSkills={userSkills ?? []} availableSkills={availableSkills} />;
}
