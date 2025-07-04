"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Draggable } from "./draggable";

type SkillCardProps = {
  id: number;
  skillName: string;
  proficiency: string;
  created_at: string;
  width?: number | undefined;
};

export function SkillCard({ id, skillName, proficiency, created_at, width }: SkillCardProps) {
  const router = useRouter();

  return (
    <Draggable id={id} width={width}>
      <Card
        key={id}
        id={`skill-card-${id.toString()}`}
        className="border border-border cursor-pointer"
        onClick={() => router.push(`/skills/${id}/journals`)}
      >
        <CardContent className="p-4">
          <div className="font-medium text-lg">{skillName}</div>
          <div className="text-sm text-muted-foreground">Created: {new Date(created_at).toLocaleDateString()}</div>
          <Badge variant="outline" className="mt-2">
            {proficiency}
          </Badge>
        </CardContent>
      </Card>
    </Draggable>
  );
}
