"use state";
import { useState } from "react";
import { SkillCard } from "@/components/ui/skill-card";
import { Droppable } from "../ui/droppable";
import { UserSkillDialog } from "../ui/user-skill-dialog";
import { Skills, UserSkills } from "@/lib/types";
import { toast } from "sonner";
import { Proficiency } from "@/lib/types";
import { useCreateUserSkill } from "@/hooks/users";
import { LEVEL_TEXT_COLORS } from "@/lib/const";
import { useAuthContext } from "@/context/auth";

type KanbanColumnProps = {
  level: Proficiency;
  droppableId: string;
  userSkills: UserSkills;
  availableSkills: Skills;
};

export default function KanbanColumn({ level, droppableId, userSkills, availableSkills }: KanbanColumnProps) {
  const { mutateAsync: createUserSkill } = useCreateUserSkill();
  const [open, setOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [proficiency, setProficiency] = useState<Proficiency>(level);
  const { user } = useAuthContext();

  const handleCreateUserSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!selectedSkillId) {
        toast.error("Failed to create user skill. Please select a skill.");
        return;
      }

      if (user?.username) {
        const newUserSkill = await createUserSkill({
          user_id: user.username,
          skill_id: selectedSkillId,
          proficiency: proficiency,
        });
        setOpen(false);
        setSelectedSkillId(null);
        setProficiency(level);
        toast.success(`Successfully created: ${newUserSkill?.skill.name} ${proficiency}`);
      } else {
        toast.error("Could not find user.");
      }
    } catch (error) {
      console.error("Failed to create user skill", error);
      toast.error("Failed to create user skill");
    }
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
    setSelectedSkillId(null);
    setProficiency(level);
  };

  return (
    <Droppable id={droppableId} className="bg-muted rounded-xl p-4 shadow-sm mt-5">
      <h2 className={`text-xl font-semibold mb-4 flex items-center justify-between ${LEVEL_TEXT_COLORS[level]}`}>
        {level}
        <UserSkillDialog
          onSubmit={handleCreateUserSkill}
          selectedSkillId={selectedSkillId}
          setSelectedSkillId={setSelectedSkillId}
          level={proficiency}
          setProficiency={setProficiency}
          open={open}
          setOpen={setOpen}
          onOpenChange={handleOpenChange}
          onClose={handleCloseDialog}
          availableSkills={availableSkills}
        />
      </h2>
      <div className="space-y-3 flex flex-col">
        {userSkills
          .filter((us) => us.proficiency === level)
          .map((us) => (
            <SkillCard
              key={us.id}
              id={us.id}
              skillName={us.skill.name}
              category={us.skill.category}
              proficiency={us.proficiency}
              created_at={us.created_at}
            />
          ))}
      </div>
    </Droppable>
  );
}
