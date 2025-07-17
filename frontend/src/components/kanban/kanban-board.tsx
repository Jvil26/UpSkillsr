"use client";
import KanbanColumn from "./kanban-column";
import { useState, useEffect } from "react";
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
import { UserSkills, Proficiency, UserSkill, Skills, UserSkillPayload } from "@/lib/types";
import { useUpdateUserSkillById } from "@/hooks/users";
import { useAuthContext } from "@/context/auth";

type KanbanBoardProps = {
  userSkills: UserSkills;
  availableSkills: Skills;
};

export default function KanbanBoard({ userSkills, availableSkills }: KanbanBoardProps) {
  const { mutateAsync: updateUserSkillbyId } = useUpdateUserSkillById();
  const [usrSkills, setUserSkills] = useState<UserSkills>(userSkills);
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
      const newUserSkills = userSkills.map((us) => {
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
        setUserSkills(newUserSkills);
        await updateUserSkillbyId({ id: Number(active.id), data: newUserSkillData });
      }
    }
    setActiveSkill(null);
    setDraggedWidth(undefined);
  };

  function handleDragStart(event: DragStartEvent) {
    const skill = userSkills.find((s) => s.id === event.active.id);
    setActiveSkill(skill ?? null);
    const el = document.getElementById(`skill-card-${event.active.id.toString()}`);
    if (el) {
      const width = el.getBoundingClientRect().width;
      setDraggedWidth(width);
    }
  }

  useEffect(() => {
    if (userSkills) {
      setUserSkills(userSkills);
    }
  }, [userSkills]);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="grid grid-cols-1 min-h-screen md:grid-cols-3 gap-4 pt-4 px-4 pb-10 pt-[calc(var(--nav-height))] max-w-screen">
        {PROFIENCIES.map((level) => (
          <KanbanColumn
            key={`kanban-column-${level}`}
            level={level}
            droppableId={level}
            userSkills={usrSkills.filter((userSkill) => userSkill.proficiency === level)}
            availableSkills={availableSkills}
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
