"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Label } from "./label";
import clsx from "clsx";
import { z } from "zod";
import { skillsSchema, Skill } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SkillSelectorProps = z.object({
  label: z.string(),
  allSkills: skillsSchema.optional(),
  selected: skillsSchema,
  setSelected: z.function().args(skillsSchema).returns(z.void()),
});

export default function SkillSelector({ label, allSkills, selected, setSelected }: z.infer<typeof SkillSelectorProps>) {
  const toggleSkill = (skill: Skill) => {
    if (selected.includes(skill)) {
      setSelected(selected.filter((s) => s.name !== skill.name));
    } else {
      setSelected([...selected, skill]);
    }
  };

  return (
    <div className="mb-4">
      <Label className="block mb-1 font-semibold text-base">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selected.length > 0 ? selected.map((skill) => skill.name).join(", ") : "Select skills..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" avoidCollisions={false} className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search skills..." />
            <CommandGroup className="max-h-60 overflow-y-auto">
              {allSkills?.map((skill) => (
                <CommandItem key={skill.id} onSelect={() => toggleSkill(skill)} className="cursor-pointer">
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4",
                      selected.some((s) => s.id === skill.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {skill.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
