"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import JournalView from "./journal-view";
import AIInputPanel from "./ai-input-panel";
import { Button } from "./button";
import { useFetchJournalById } from "@/hooks/journals";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PROMPT_LABELS, VIEW_MODES } from "@/lib/const";
import JournalEdit from "./journal-edit";

import {
  useCreateJournal,
  useUpdateJournalById,
  useGenerateJournalSummary,
  useGenerateJournal,
  useBatchUpdateResourceLinks,
} from "@/hooks/journals";
import { ViewMode } from "@/lib/types";

type JournalCreatorProps = {
  isNew: boolean;
  journalId: number;
  userSkillId: number;
};

export default function JournalCreator({ isNew, journalId, userSkillId }: JournalCreatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [resourceLinks, setResourceLinks] = useState<{ type: string; title: string; url: string }[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    PROMPT_LABELS.reduce((acc, prompt) => ({ ...acc, [prompt.id]: "" }), {})
  );
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get("viewMode") as ViewMode) || isNew ? VIEW_MODES.EDIT : VIEW_MODES.PREVIEW
  );

  const { mutateAsync: createJournal, isPending: createPending } = useCreateJournal();
  const { mutateAsync: updateJournalById, isPending: updatePending } = useUpdateJournalById();
  const { mutateAsync: generateSummary, isPending: isGeneratingSummary } = useGenerateJournalSummary();
  const { mutateAsync: generateJournal, isPending: isGeneratingJournal } = useGenerateJournal();
  const { mutateAsync: batchUpdateResourceLinks } = useBatchUpdateResourceLinks();

  useEffect(() => {
    if (journal) {
      console.log(journal);
      setTitle(journal.title || "");
      setTextContent(journal.text_content || "");
      setSummary(journal.summary || "");
      setResourceLinks(journal.resource_links || []);
      const answersFromPrompts: Record<string, string> = {};

      for (const label of PROMPT_LABELS) {
        const matchingPrompt = journal.prompts.find((p) => p.question === label.label);
        if (matchingPrompt) {
          answersFromPrompts[label.id] = matchingPrompt.answer;
        }
      }
      setAnswers(answersFromPrompts);
    }
  }, [journal]);

  const handleViewChange = (viewMode: ViewMode) => {
    setViewMode(viewMode);
    router.replace(`/skills/${userSkillId}/journals/${isNew ? "new" : journalId}?viewMode=${viewMode}`);
  };

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
      const formData = new FormData();
      formData.append("user_skill", String(userSkillId));
      formData.append("title", title);
      formData.append("text_content", textContent);
      formData.append("summary", summary);
      const prompts = PROMPT_LABELS.map(({ id, label }) => {
        return {
          question: label,
          answer: answers[id].trim(),
        };
      });
      formData.append("prompts", JSON.stringify(prompts));
      if (media) formData.append("media", media);
      let journal;
      if (isNew) {
        journal = await createJournal(formData);
      } else {
        journal = await updateJournalById({ id: journalId, journalData: formData });
      }

      console.log("RESOURCE LINKS BEFORE", resourceLinks);

      if (journal?.id && resourceLinks) {
        console.log("RESOURCE LINKS AFTER", resourceLinks);
        try {
          const resourceLinksData = resourceLinks.filter((rl) => rl.title?.trim() && rl.url?.trim() && rl.type?.trim());
          await batchUpdateResourceLinks({ journalId: journal.id, resourceLinks: resourceLinksData });
        } catch {
          toast.error("Journal saved but failed to update resource links.");
          return;
        }
      }

      router.replace(`/skills/${userSkillId}/journals/${journal?.id}`);
      toast.success("Journal saved successfully!");
      console.log("Saving journal:", Object.fromEntries(formData.entries()));
    } catch (error) {
      console.error(error);
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
      const prompts = PROMPT_LABELS.map(({ id, label }) => {
        return {
          question: label,
          answer: answers[id].trim(),
        };
      });

      const journalData = await generateJournal({ userSkillId, prompts });
      if (journalData && journalData.title?.trim() && journalData.text_content?.trim() && journalData.summary?.trim()) {
        setTitle(journalData.title);
        setTextContent(journalData.text_content);
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

  const addResourceLink = () => {
    setResourceLinks([...resourceLinks, { type: "", title: "", url: "" }]);
  };

  const updateResourceLink = (index: number, key: string, value: string) => {
    const newLinks = [...resourceLinks];
    newLinks[index][key as keyof (typeof newLinks)[0]] = value;
    setResourceLinks(newLinks);
  };

  const removeResourceLink = (index: number) => {
    const newLinks = [...resourceLinks];
    newLinks.splice(index, 1);
    setResourceLinks(newLinks);
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
      {viewMode === VIEW_MODES.EDIT ? (
        <>
          <div className="w-full md:w-8/10 flex flex-col my-5 justify-between">
            <div className="flex flex-col sm:flex-row gap-x-10 mb-10 items-center">
              <div className="flex flex-col gap-y-3 sm:items-start items-center">
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
              promptLabels={PROMPT_LABELS}
              answers={answers}
              isGeneratingJournal={isGeneratingJournal}
              onChange={handlePromptInputChange}
              onSubmit={handleGenerateJournal}
            />
          </div>
          <JournalEdit
            title={title}
            textContent={textContent}
            media={journal?.media}
            resourceLinks={resourceLinks}
            updateResourceLink={updateResourceLink}
            addResourceLink={addResourceLink}
            removeResourceLink={removeResourceLink}
            summary={summary}
            setTitle={setTitle}
            setTextContent={setTextContent}
            setSummary={setSummary}
            isGeneratingSummary={isGeneratingSummary}
            onGenerateSummary={handleGenerateSummary}
            onMediaChange={handleMediaChange}
            onViewChange={handleViewChange}
            onSave={handleSave}
          />
        </>
      ) : (
        <JournalView
          title={title}
          textContent={textContent}
          media={journal?.media}
          resourceLinks={resourceLinks}
          summary={summary}
          onViewChange={handleViewChange}
          createdAt={journal?.created_at}
        />
      )}
    </div>
  );
}
