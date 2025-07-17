"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type AIInputPanelProps = {
  isGeneratingJournal: boolean;
  promptLabels: {
    id: string;
    label: string;
    placeholder: string;
  }[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function JournalAIInputPanel({
  promptLabels,
  isGeneratingJournal,
  onChange,
  answers,
  onSubmit,
}: AIInputPanelProps) {
  return (
    <form className="h-full w-full md:w-9/10 flex flex-col gap-y-3" onSubmit={(e) => onSubmit(e)}>
      {promptLabels.map(({ id, label, placeholder }) => (
        <div key={id}>
          <Label className="text-[1.2rem]">{label}</Label>
          <Textarea
            id={id}
            value={answers[id]}
            onChange={(e) => onChange(id, e.target.value)}
            className="min-h-30 h-auto !text-[0.95rem] resize-none"
            placeholder={placeholder}
          />
        </div>
      ))}
      <div className="flex justify-center">
        <Button type="submit" disabled={isGeneratingJournal} className="w-2/5 font-semibold text-[1rem] p-6 h-10 mt-3">
          <Sparkles />
          {isGeneratingJournal ? "Generating Journal..." : "Generate Journal"}
        </Button>
      </div>
    </form>
  );
}
