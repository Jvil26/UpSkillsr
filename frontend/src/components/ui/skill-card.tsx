"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Draggable } from "../ui/draggable";
import { CATEGORY_BG_COLORS, LEVEL_BG_COLORS } from "@/lib/const";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useDeleteUserSkillById } from "@/hooks/users";
// import { useUpdateUserSkillById } from "@/hooks/users";

type SkillCardProps = {
  id: number;
  skillName: string;
  category: string;
  proficiency: string;
  created_at: string;
  width?: number | undefined;
};

export function SkillCard({ id, skillName, category, proficiency, created_at, width }: SkillCardProps) {
  const { mutate: deleteUserSkillById } = useDeleteUserSkillById();
  // const { mutate: updateUserSkillById } = useUpdateUserSkillById();
  const router = useRouter();

  const handleEditSkill = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteSkill = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteUserSkillById(id);
  };

  return (
    <Draggable id={id} width={width}>
      <Card
        key={id}
        id={`skill-card-${id.toString()}`}
        className="border border-border cursor-pointer pt-3 pb-1"
        onClick={() => router.push(`/skills/${id}/journals`)}
      >
        <CardHeader className="flex items-start justify-between pr-1 pl-4">
          <CardTitle className="text-lg font-semibold">{skillName}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="p-1 m-0 bg-transparent border-none hover:bg-muted rounded-sm cursor-pointer"
                onClick={(e) => e.stopPropagation()} // prevent card click
                aria-label="More options"
              >
                <MoreVertical className="w-6 h-6 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleEditSkill(e)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleDeleteSkill(e)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex justify-between items-center pb-1 mt-15 px-3">
          <div className="text-sm text-muted-foreground">Created: {new Date(created_at).toLocaleDateString()}</div>
          <div className="flex gap-x-2">
            <Badge variant="outline" className={`${CATEGORY_BG_COLORS[category]}`}>
              {category}
            </Badge>
            <Badge variant="outline" className={`${LEVEL_BG_COLORS[proficiency]}`}>
              {proficiency}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Draggable>
  );
}
