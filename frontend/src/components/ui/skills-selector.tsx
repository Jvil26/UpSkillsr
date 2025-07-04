"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Label } from "./label";
import clsx from "clsx";
import { z } from "zod";
import { skillsSchema, Skill, skillSchema } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SkillSelectorProps = z.object({
  availableSkills: skillsSchema,
  selected: skillSchema.nullable(),
  setSelected: z.function().args(skillSchema.nullable()).returns(z.void()),
});

export default function SkillSelector({ availableSkills, selected, setSelected }: z.infer<typeof SkillSelectorProps>) {
  const toggleSkill = (skill: Skill) => {
    if (selected?.id == skill.id) {
      setSelected(null);
    } else {
      setSelected(skill);
    }
  };

  return (
    <div className="mb-4">
      <Label className="block mb-1 font-semibold text-base">Choose a Skill</Label>
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selected?.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          avoidCollisions={false}
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command>
            <CommandInput placeholder="Search skills..." />
            <CommandGroup className="max-h-60 overflow-y-auto">
              {availableSkills?.map((skill) => (
                <CommandItem
                  key={skill.id}
                  onSelect={() => toggleSkill(skill)}
                  className={clsx("cursor-pointer", selected?.id === skill.id && "bg-muted")}
                >
                  {skill.name}
                  <Check
                    className={clsx("mr-2 h-4 w-4 ml-auto", selected?.id === skill.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
