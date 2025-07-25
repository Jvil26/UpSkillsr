"use client";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { Input } from "../ui/input";
import {
  ListFilter,
  ArrowDownAZ,
  ArrowDownZA,
  ClockArrowDown,
  ClockArrowUp,
  SearchIcon,
  ArrowUpDown,
  XCircle,
} from "lucide-react";
import { PROFIENCIES } from "@/lib/const";
import { Filters } from "@/lib/types";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SORT_OPTIONS = [
  {
    value: "asc",
    label: "A -> Z",
    icon: <ArrowDownAZ />,
  },
  {
    value: "desc",
    label: "Z -> A",
    icon: <ArrowDownZA />,
  },
  {
    value: "newest_to_oldest",
    label: "Newest to Oldest",
    icon: <ClockArrowDown />,
  },
  {
    value: "oldest_to_newest",
    label: "Oldest to Newest",
    icon: <ClockArrowUp />,
  },
];

type JournalFilterProps = {
  filters: Filters;
  onChange: (updated: Partial<Filters>) => void;
};

export default function JournalFilters({ filters, onChange }: JournalFilterProps) {
  return (
    <div className="flex bg-card mt-10 mb-5 p-3 items-center justify-between">
      <SearchBar value={filters.search} onChange={(val: string) => onChange({ search: val })} />
      <div className="flex ml-auto items-center">
        <ProficiencyFilter
          value={filters.proficiency}
          onChange={(val: string) => {
            onChange({ proficiency: val === filters.proficiency ? "" : val });
          }}
        />
        <SortFilter
          value={filters.sort}
          onChange={(val: string) => onChange({ sort: val === filters.sort ? "" : val })}
        />
        <ResetFilters onChange={() => onChange({ sort: "newest_to_oldest", proficiency: "", search: "" })} />
      </div>
    </div>
  );
}

export function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="flex w-full items-center">
      <Input
        type="text"
        placeholder="Search"
        className="!bg-muted rounded-none !text-[1rem] w-1/2 focus:w-full transition-[width] duration-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <SearchIcon className="mx-2 w-5 h-5" />
    </div>
  );
}

export function SortFilter({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Select value={value} onValueChange={onChange} open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger className="rounded p-2 !bg-transparent border-none [&>svg:nth-of-type(2)]:hidden cursor-pointer ">
            <ArrowUpDown className="text-white !w-7 !h-7" />
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent>Sort Filter</TooltipContent>
      </Tooltip>
      <SelectContent className="bg-muted">
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          {SORT_OPTIONS.map((option, idx) => (
            <SelectItem key={`sort-filter-${idx}`} value={option.value} className="cursor-pointer hover:opacity-75">
              <span>{option.label}</span>
              {option.icon}
            </SelectItem>
          ))}
        </SelectGroup>
        <Button
          className="w-full px-2 mt-2"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
            setOpen(false);
          }}
        >
          Clear
        </Button>
      </SelectContent>
    </Select>
  );
}

export function ProficiencyFilter({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Select value={value} onValueChange={onChange} open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger className="rounded p-2 !bg-transparent border-none [&>svg:nth-of-type(2)]:hidden cursor-pointer">
            <ListFilter className="text-white !w-7 !h-7" />
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent>Proficiency Filter</TooltipContent>
      </Tooltip>
      <SelectContent className="bg-muted">
        <SelectGroup>
          <SelectLabel>Filter by Proficiency</SelectLabel>
          {PROFIENCIES.map((category, idx) => (
            <SelectItem key={`category-filter-${idx}`} value={category} className="hover:opacity-75 cursor-pointer">
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
        <Button
          className="w-full px-2 mt-2"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
            setOpen(false);
          }}
        >
          Clear
        </Button>
      </SelectContent>
    </Select>
  );
}

export function ResetFilters({ onChange }: { onChange: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="bg-transparent cursor-pointer p-2" onClick={onChange}>
          <XCircle className="w-7 h-7" />
        </button>
      </TooltipTrigger>
      <TooltipContent>Reset All Filters</TooltipContent>
    </Tooltip>
  );
}
