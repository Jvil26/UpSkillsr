"use client";
import KanbanColumn from "./kanban-column";
import { useState, useEffect } from "react";
import { SkillCard } from "./skill-card";
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
import { UserSkills, Proficiency, UserSkill, Skills } from "@/lib/types";

type KanbanBoardProps = {
  userSkills: UserSkills;
  availableSkills: Skills;
};

export default function KanbanBoard({ userSkills, availableSkills }: KanbanBoardProps) {
  const [usrSkills, setUserSkills] = useState<UserSkills>(userSkills);
  const [draggedWidth, setDraggedWidth] = useState<number | undefined>(undefined);
  const [activeSkill, setActiveSkill] = useState<UserSkill | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && over.id) {
      const newUserSkills = userSkills.map((us) => {
        if (us.id === active.id) {
          if (us.proficiency !== over?.id) {
            us.proficiency = over.id as Proficiency;
          }
        }
        return us;
      });
      setUserSkills(newUserSkills);
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
      console.log(userSkills);
    }
  }, [userSkills]);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 px-4 pb-10 pt-[calc(var(--nav-height))]">
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
            proficiency={activeSkill.proficiency}
            created_at={activeSkill.created_at}
            width={draggedWidth}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
