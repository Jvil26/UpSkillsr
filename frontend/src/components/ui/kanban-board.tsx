"use client";
import KanbanColumn from "./kanban-column";
import { useState } from "react";
import { SkillCard } from "./skill-card";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensors,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";

const proficiencyColumns = ["Beginner", "Intermediate", "Advanced"];

const levelTextColors: Record<string, string> = {
  Beginner: "green-500",
  Intermediate: "orange-500",
  Advanced: "red-500",
};

type KanbanBoardProps = {
  userSkills: {
    id: number;
    skill: string;
    proficiency: string;
    created_at: string;
  }[];
};

export default function KanbanBoard({ userSkills }: KanbanBoardProps) {
  const [usrSkills, setUserSkills] = useState(userSkills);
  const [draggedWidth, setDraggedWidth] = useState<number | undefined>(undefined);

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
            us.proficiency = String(over.id);
          }
        }
        return us;
      });
      setUserSkills(newUserSkills);
    }
    setActiveSkill(null);
    setDraggedWidth(undefined);
  };

  const [activeSkill, setActiveSkill] = useState<any>(null);

  function handleDragStart(event: DragStartEvent) {
    const skill = userSkills.find((s) => s.id === event.active.id);
    setActiveSkill(skill ?? null);
    const el = document.getElementById(`skill-card-${event.active.id.toString()}`);
    if (el) {
      const width = el.getBoundingClientRect().width;
      setDraggedWidth(width);
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-[calc(var(--nav-height))]">
        {proficiencyColumns.map((level) => (
          <KanbanColumn
            key={level}
            level={level}
            droppableId={level}
            userSkills={usrSkills.filter((userSkill) => userSkill.proficiency === level)}
            textColor={levelTextColors[level]}
          />
        ))}
      </div>
      <DragOverlay>{activeSkill && <SkillCard userSkill={activeSkill} width={draggedWidth} />}</DragOverlay>
    </DndContext>
  );
}
