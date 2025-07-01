"use client";
import KanbanBoard from "@/components/ui/kanban-board";
import { useFetchUser } from "@/hooks/users";

export default function Home() {
  // const { data: currentUser, isFetching: isFetchingCurrentUser } = useFetchUser();

  const userSkills = [
    {
      id: 1,
      skill: "React",
      proficiency: "Beginner",
      created_at: "2025-06-01",
    },
    {
      id: 2,
      skill: "Python",
      proficiency: "Intermediate",
      created_at: "2025-05-20",
    },
    {
      id: 3,
      skill: "SQL",
      proficiency: "Advanced",
      created_at: "2025-04-10",
    },
    {
      id: 4,
      skill: "Docker",
      proficiency: "Beginner",
      created_at: "2025-06-10",
    },
    {
      id: 5,
      skill: "Django",
      proficiency: "Intermediate",
      created_at: "2025-05-15",
    },
    {
      id: 6,
      skill: "GraphQL",
      proficiency: "Advanced",
      created_at: "2025-03-30",
    },
  ];

  return <KanbanBoard userSkills={userSkills} />;
}
