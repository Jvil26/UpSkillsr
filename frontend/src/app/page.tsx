import KanbanBoard from "@/components/kanban/kanban-board";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "./get-query-client";
import { fetchAllSkills } from "@/api/skills";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({ queryKey: ["allSkills"], queryFn: fetchAllSkills });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <KanbanBoard />
    </HydrationBoundary>
  );
}
