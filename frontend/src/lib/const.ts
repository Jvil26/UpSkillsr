import { Proficiency, ViewMode } from "./types";

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

export const CATEGORY_BG_COLORS: Record<string, string> = {
  Instruments: "bg-sky-500",
  Tech: "bg-blue-600",
  Writing: "bg-violet-600",
  Languages: "bg-yellow-500",
  Design: "bg-pink-500",
  Marketing: "bg-amber-600",
  Business: "bg-teal-600",
  "Data & Analytics": "bg-indigo-600",
  "Personal Development": "bg-lime-600",
  "Sports & Fitness": "bg-rose-500",
  "Culinary Arts": "bg-emerald-500",
  "Crafts & DIY": "bg-fuchsia-600",
};

export const PROMPT_LABELS = [
  {
    id: "ai-prompt1",
    label: "What did you learn?",
    placeholder: "Describe any new skills, concepts, or tools you explored (required)",
  },
  {
    id: "ai-prompt2",
    label: "What was challenging?",
    placeholder: "Reflect on any obstacles, bugs, or concepts that were difficult to understand (required)",
  },
  {
    id: "ai-prompt3",
    label: "What do you still find confusing?",
    placeholder: "Mention any topics you’re struggling with or want to review again (required)",
  },
];

export const VIEW_MODES = {
  EDIT: "Edit" as ViewMode,
  PREVIEW: "Preview" as ViewMode,
};
