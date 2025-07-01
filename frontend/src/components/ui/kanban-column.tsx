import { SkillCard } from "./skill-card";
import { Droppable } from "./droppable";
import { Plus } from "lucide-react";

type KanbanColumnProps = {
  level: string;
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
  return (
    <Droppable id={droppableId} className="bg-muted rounded-xl p-4 shadow-sm mt-5">
      <h2 className={`text-xl font-semibold mb-4 flex items-center justify-between text-${textColor}`}>
        {level}
        <Plus className="w-6 h-6 cursor-pointer hover:text-muted-foreground text-white" />
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
