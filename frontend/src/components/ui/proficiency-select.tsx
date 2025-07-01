import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Proficiency } from "@/lib/types";
import { PROFIENCIES } from "@/lib/const";
import { Label } from "./label";

type ProficiencySelectProps = {
  defaultValue: Proficiency;
  setProficiency: React.Dispatch<React.SetStateAction<Proficiency>>;
};

export function ProficiencySelect({ defaultValue, setProficiency }: ProficiencySelectProps) {
  return (
    <Select onValueChange={(value: Proficiency) => setProficiency(value)} defaultValue={defaultValue}>
      <Label className="block font-semibold text-base">Proficiency</Label>
      <SelectTrigger className="w-full cursor-pointer">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="cursor-pointer">
          <SelectLabel>Select a Profiency</SelectLabel>
          {PROFIENCIES.map((level) => (
            <SelectItem key={`proficiency-select-item-${level}`} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
