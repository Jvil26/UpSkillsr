"use client";
import { useEffect, useState } from "react";
import JournalView from "./journal-view";
import AIInputPanel from "./ai-input-panel";
import { Button } from "./button";
import { useFetchJournalById } from "@/hooks/journals";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  useCreateJournal,
  useUpdateJournalById,
  useGenerateJournalSummary,
  useGenerateJournal,
} from "@/hooks/journals";

type JournalCreatorProps = {
  isNew: boolean;
  journalId: number;
  userSkillId: number;
};

const promptLabels = [
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
    label: "What do you want to improve next week?",
    placeholder: "List areas you want to strengthen or focus on next week (optional)",
  },
];

export default function JournalCreator({ isNew, journalId, userSkillId }: JournalCreatorProps) {
  const {
    data: journal,
    isFetching: isFetchingJournal,
    isError: isErrorFetchingJournal,
  } = useFetchJournalById(journalId, {
    enabled: !isNew && !!journalId,
  });

  const [title, setTitle] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [youtubeURL, setYoutubeURL] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    promptLabels.reduce((acc, prompt) => ({ ...acc, [prompt.id]: "" }), {})
  );
  const { mutateAsync: createJournal, isPending: createPending } = useCreateJournal();
  const { mutateAsync: updateJournalById, isPending: updatePending } = useUpdateJournalById();
  const { mutateAsync: generateSummary, isPending: isGeneratingSummary } = useGenerateJournalSummary();
  const { mutateAsync: generateJournal, isPending: isGeneratingJournal } = useGenerateJournal();

  useEffect(() => {
    if (journal) {
      console.log(journal);
      setTitle(journal.title || "");
      setTextContent(journal.text_content || "");
      setYoutubeURL(journal.youtube_url || "");
      setSummary(journal.summary || "");
      const answersFromPrompts: Record<string, string> = {};

      for (const label of promptLabels) {
        const matchingPrompt = journal.prompts.find((p) => p.question === label.label);
        if (matchingPrompt) {
          answersFromPrompts[label.id] = matchingPrompt.answer;
        }
      }
      setAnswers(answersFromPrompts);
    }
  }, [journal]);

  const handlePromptInputChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      if (textContent) {
        const summary = await generateSummary(textContent);
        setSummary(summary);
      }
    } catch {
      toast.error("Error generating journal summary.");
    }
  };

  const handleSave = async () => {
    try {
      if (!title) {
        toast.error("Failed to journal. Title cannot be empty");
        return;
      }
      if (!textContent) {
        toast.error("Failed to journal. Content cannot be empty");
        return;
      }
      if (youtubeURL) {
        const url = youtubeURL.trim().toLowerCase();
        if (url && !url.includes("youtube.com") && !url.includes("youtu.be")) {
          toast.error("Failed to journal. Please provide a valid YouTube link or upload a file.");
          return;
        }
      }
      const formData = new FormData();
      formData.append("user_skill", String(userSkillId));
      formData.append("title", title);
      formData.append("text_content", textContent);
      formData.append("summary", summary);
      const prompts = promptLabels.map(({ id, label }) => {
        return {
          question: label,
          answer: answers[id].trim(),
        };
      });
      formData.append("prompts", JSON.stringify(prompts));
      if (media) formData.append("media", media);
      if (youtubeURL) formData.append("youtube_url", youtubeURL);
      if (isNew) {
        await createJournal(formData);
      } else {
        await updateJournalById({ id: journalId, journalData: formData });
      }
      toast.success("Journal saved successfully!");
      console.log("Saving journal:", Object.fromEntries(formData.entries()));
    } catch {
      toast.error("Failed to save journal.");
    }
  };

  const handleGenerateJournal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (Object.values(answers).some((answer) => answer.trim() === "")) {
        toast.error("Please answer the all the prompts to be able to generate the journal.");
        return;
      }
      const prompts = promptLabels.map(({ id, label }) => {
        return {
          question: label,
          answer: answers[id].trim(),
        };
      });

      console.log("PROMPTS: ", prompts);

      const journalData = await generateJournal({ userSkillId, prompts });
      console.log(journalData);
      if (
        journalData &&
        journalData.title?.trim() &&
        journalData.text_content?.trim() &&
        journalData.youtube_url?.trim() &&
        journalData.summary?.trim()
      ) {
        setTitle(journalData.title);
        setTextContent(journalData.text_content);
        setYoutubeURL(journalData.youtube_url);
        setSummary(journalData.summary);
        toast.success("Successfully generated the journal!");
      } else {
        toast.error("There was an error generating the journal. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an error generating the journal. Please try again.");
    }
  };

  if (isFetchingJournal) {
    return <Loader2 className="h-10 w-10 animate-spin" />;
  }

  if (isErrorFetchingJournal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted pt-[calc(var(--nav-height))] p-1 sm:pl-10 sm:pr-7 sm:pb-10">
        <h1 className="text-[2rem] font-bold">Error fetching journal. Check that the Journal exists. </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center md:flex-row md:items-start justify-center gap-x-5 bg-muted pt-[calc(var(--nav-height))] p-1 sm:pl-10 sm:pr-7 sm:pb-10">
      <div className="w-full md:w-8/10 flex flex-col my-5 justify-between">
        <div className="flex gap-x-10 mb-10 items-center">
          <div className="flex flex-col gap-y-3">
            <h1 className="text-[1.5rem] font-bold text-center underline underline-offset-8">
              {isNew ? "New Journal" : title || "Untitled Journal"}
            </h1>
            {journal?.updated_at && <p>Last saved: {new Date(journal.updated_at).toLocaleString()}</p>}
          </div>
          <Button
            type="button"
            disabled={createPending || updatePending}
            onClick={handleSave}
            className="w-25 bg-muted hover:text-black text-white font-semibold border border-border border-white mt-3"
          >
            {createPending || updatePending ? "Saving..." : "Save"}
          </Button>
        </div>
        <AIInputPanel
          promptLabels={promptLabels}
          answers={answers}
          isGeneratingJournal={isGeneratingJournal}
          onChange={handlePromptInputChange}
          onSubmit={handleGenerateJournal}
        />
      </div>
      <JournalView
        title={title}
        textContent={textContent}
        media={journal?.media}
        youtubeURL={youtubeURL}
        summary={summary}
        setTitle={setTitle}
        setTextContent={setTextContent}
        setSummary={setSummary}
        setYoutubeURL={setYoutubeURL}
        isGeneratingSummary={isGeneratingSummary}
        onGenerateSummary={handleGenerateSummary}
        onMediaChange={handleMediaChange}
        onSave={handleSave}
      />
    </div>
  );
}
