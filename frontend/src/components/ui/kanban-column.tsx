"use state";
import { useState } from "react";
import { SkillCard } from "./skill-card";
import { Droppable } from "./droppable";
import { CreateUserSkillDialog } from "./create-user-skill-dialog";
import { Skill } from "@/lib/types";
import { toast } from "sonner";
import { Proficiency } from "@/lib/types";

type KanbanColumnProps = {
  level: Proficiency;
  droppableId: string;
  userSkills: {
    id: number;
    skill: string;
    proficiency: string;
    created_at: string;
  }[];
  textColor: string;
};

export default function KanbanColumn({ level, droppableId, userSkills, textColor }: KanbanColumnProps) {
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [proficiency, setProficiency] = useState<Proficiency>(level);

  const handleCreateUserSkill = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("here");
    e.preventDefault();
    if (!selectedSkill) {
      toast.error("Failed to create user skill. Please select a skill.");
      return;
    }
    toast.success(`Successfully created: ${selectedSkill.name} ${proficiency}`);
    setOpen(false);
    setSelectedSkill(null);
    setProficiency(level);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCloseDialog();
    } else {
      setOpen(isOpen);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedSkill(null);
    setProficiency(level);
  };

  return (
    <Droppable id={droppableId} className="bg-muted rounded-xl p-4 shadow-sm mt-5">
      <h2 className={`text-xl font-semibold mb-4 flex items-center justify-between ${textColor}`}>
        {level}
        <CreateUserSkillDialog
          onSubmit={handleCreateUserSkill}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          level={proficiency}
          setProficiency={setProficiency}
          open={open}
          setOpen={setOpen}
          onOpenChange={handleOpenChange}
          onClose={handleCloseDialog}
        />
      </h2>
      <div className="space-y-3 flex flex-col">
        {userSkills
          .filter((skill) => skill.proficiency === level)
          .map((skill) => (
            <SkillCard key={skill.id} userSkill={skill} />
          ))}
      </div>
    </Droppable>
  );
}
