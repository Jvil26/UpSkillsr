import { Proficiency } from "./types";

export const PROFIENCIES: Proficiency[] = ["Beginner", "Intermediate", "Advanced"];

export const LEVEL_TEXT_COLORS: Record<string, string> = {
  Beginner: "text-green-500",
  Intermediate: "text-orange-500",
  Advanced: "text-red-500",
};

export const LEVEL_BG_COLORS: Record<string, string> = {
  Beginner: "bg-green-500",
  Intermediate: "bg-orange-500",
  Advanced: "bg-red-500",
};
