"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserSkill } from "@/lib/types";
import { Draggable } from "./draggable";

type SkillCardProps = {
  userSkill: {
    id: number;
    skill: string;
    proficiency: string;
    created_at: string;
  };
  width?: number | undefined;
};

export function SkillCard({ userSkill, width }: SkillCardProps) {
  const router = useRouter();
  const handleCardClick = (skillName: string) => {
    router.push(`/skills/${skillName}/journals`);
  };

  return (
    <Draggable id={userSkill.id} width={width}>
      <Card
        key={userSkill.id}
        id={`skill-card-${userSkill.id.toString()}`}
        className="border border-border cursor-pointer"
        onClick={() => handleCardClick(userSkill.skill)}
      >
        <CardContent className="p-4">
          <div className="font-medium text-lg">{userSkill.skill}</div>
          <div className="text-sm text-muted-foreground">
            Created: {new Date(userSkill.created_at).toLocaleDateString()}
          </div>
          <Badge variant="outline" className="mt-2">
            {userSkill.proficiency}
          </Badge>
        </CardContent>
      </Card>
    </Draggable>
  );
}
