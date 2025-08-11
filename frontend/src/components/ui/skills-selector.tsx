"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Label } from "./label";
import clsx from "clsx";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SkillSelectorProps<T extends { id: number }> {
  availableSkills: T[];
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  getName: (item: T) => string;
  disabled?: boolean;
}

export default function SkillSelector<T extends { id: number }>({
  availableSkills,
  selectedId,
  setSelectedId,
  getName,
  disabled,
}: SkillSelectorProps<T>) {
  const toggleSkill = (skill: T) => {
    if (selectedId == skill.id) {
      setSelectedId(null);
    } else {
      setSelectedId(skill.id);
    }
  };

  const selectedItem = availableSkills.find((s) => s.id == selectedId);

  return (
    <div className="mb-4">
      <Label className="block mb-1 font-semibold text-base">Choose a Skill</Label>
      <Popover modal={true}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button variant="outline" className="w-full justify-start">
            {selectedItem ? getName(selectedItem) : "Select a Skill"}
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
                  className={clsx("cursor-pointer", selectedId === skill.id && "bg-muted")}
                >
                  {getName(skill)}
                  <Check
                    className={clsx("mr-2 h-4 w-4 ml-auto", selectedId === skill.id ? "opacity-100" : "opacity-0")}
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
