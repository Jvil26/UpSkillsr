"use client";
import KanbanColumn from "./kanban-column";
import { useState } from "react";
import { SkillCard } from "@/components/ui/skill-card";
import { PROFIENCIES } from "@/lib/const";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensors,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { Proficiency, UserSkill, UserSkillPayload } from "@/lib/types";
import { useUpdateUserSkillById, useFetchUserSkills } from "@/hooks/users";
import { useFetchAllSkills } from "@/hooks/skills";
import { useAuthContext } from "@/context/auth";

export default function KanbanBoard() {
  const { mutateAsync: updateUserSkillbyId } = useUpdateUserSkillById();
  const { data: userSkills, isError: isErrorFetchingUserSkills } = useFetchUserSkills();
  const { data: allSkills, isError: isErrorFetchingAllSkills } = useFetchAllSkills();

  const [draggedWidth, setDraggedWidth] = useState<number | undefined>(undefined);
  const [activeSkill, setActiveSkill] = useState<UserSkill | null>(null);
  const { user } = useAuthContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && over.id && user?.username) {
      let newUserSkillData: UserSkillPayload | null = null;
      userSkills?.map((us) => {
        if (us.id === active.id && us.proficiency !== over?.id) {
          us.proficiency = over.id as Proficiency;
          newUserSkillData = {
            user_id: user?.username,
            skill_id: us.skill.id,
            proficiency: us.proficiency,
          };
        }
        return us;
      });

      if (newUserSkillData) {
        await updateUserSkillbyId({ id: Number(active.id), data: newUserSkillData });
      }
    }
    setActiveSkill(null);
    setDraggedWidth(undefined);
  };

  function handleDragStart(event: DragStartEvent) {
    const skill = userSkills?.find((s) => s.id === event.active.id);
    setActiveSkill(skill ?? null);
    const el = document.getElementById(`skill-card-${event.active.id.toString()}`);
    if (el) {
      const width = el.getBoundingClientRect().width;
      setDraggedWidth(width);
    }
  }

  if (isErrorFetchingAllSkills || isErrorFetchingUserSkills) {
    return (
      <div className="min-h-screen pt-[calc(var(--nav-height))] flex justify-center items-center p-1 sm:pl-10 sm:pr-7 sm:pb-10">
        <h1 className="text-[2rem] font-bold">Error fetching from server. Try Again.</h1>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="grid grid-cols-1 min-h-screen md:grid-cols-3 gap-4 pt-4 px-4 pb-10 pt-[calc(var(--nav-height))] max-w-screen">
        {PROFIENCIES.map((level) => (
          <KanbanColumn
            key={`kanban-column-${level}`}
            level={level}
            droppableId={level}
            userSkills={userSkills ? userSkills.filter((userSkill) => userSkill.proficiency === level) : []}
            availableSkills={allSkills?.filter((skill) => !userSkills?.some((us) => us.skill.id === skill.id)) ?? []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeSkill && (
          <SkillCard
            id={activeSkill.id}
            skillName={activeSkill.skill.name}
            category={activeSkill.skill.category}
            proficiency={activeSkill.proficiency}
            created_at={activeSkill.created_at}
            width={draggedWidth}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
