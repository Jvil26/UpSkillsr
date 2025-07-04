"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import SkillSelector from "./skills-selector";
import { ProficiencySelect } from "./proficiency-select";
import { Skill, Proficiency, Skills } from "@/lib/types";
import { DialogDescription } from "@radix-ui/react-dialog";

type CreateUserSkillDialogProps = {
  open: boolean;
  level: Proficiency;
  selectedSkill: Skill | null;
  availableSkills: Skills;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  setSelectedSkill: React.Dispatch<React.SetStateAction<Skill | null>>;
  setProficiency: React.Dispatch<React.SetStateAction<Proficiency>>;
};

export function CreateUserSkillDialog({
  open,
  level,
  selectedSkill,
  availableSkills,
  onSubmit,
  onOpenChange,
  onClose,
  setOpen,
  setSelectedSkill,
  setProficiency,
}: CreateUserSkillDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Plus className="w-5 h-5 text-white hover:text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-muted">
        <form onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-y-5">
          <DialogHeader>
            <DialogTitle>Create New User Skill</DialogTitle>
            <DialogDescription>Set a new skill you want to learn. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="grid">
            <div className="grid gap-2">
              <SkillSelector
                availableSkills={availableSkills}
                selected={selectedSkill}
                setSelected={setSelectedSkill}
              />
            </div>
            <div className="grid gap-3">
              <ProficiencySelect defaultValue={level} setProficiency={setProficiency} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
