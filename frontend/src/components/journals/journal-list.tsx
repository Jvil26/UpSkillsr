"use client";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useFetchUserSkillById } from "@/hooks/users";
import { useDeleteJournalById, useFetchJournalsByUserSkillId } from "@/hooks/journals";
import { Loader2, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_BG_COLORS, LEVEL_BG_COLORS, VIEW_MODES } from "@/lib/const";
import { ViewMode } from "@/lib/types";

type JournalsListProps = {
  userSkillId: number;
};

export default function JournalList({ userSkillId }: JournalsListProps) {
  const router = useRouter();
  const pathName = usePathname();

  const {
    data: userSkill,
    isFetching: isFetchingUserSkill,
    isError: isErrorFetchingUserSkill,
  } = useFetchUserSkillById(userSkillId);
  const [page, setPage] = useState<number>(1);
  const {
    data: journals,
    isFetching: isFetchingJournals,
    isError: isErrorFetchingJournals,
  } = useFetchJournalsByUserSkillId(userSkillId, page);
  const { mutate: deleteJournalById } = useDeleteJournalById(userSkillId);

  const handleDelete = (id: number) => {
    deleteJournalById(id);
  };

  const handleView = (journalId: number, view: ViewMode) => {
    router.push(`${pathName}/${journalId}?viewMode=${encodeURIComponent(view)}`);
  };

  if (isFetchingUserSkill || isFetchingJournals) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted pt-[calc(var(--nav-height))] p-1 sm:pl-10 sm:pr-7 sm:pb-10">
        <Loader2 className="w-15 h-15 animate-spin" />
      </div>
    );
  }

  if (isErrorFetchingUserSkill || isErrorFetchingJournals) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted pt-[calc(var(--nav-height))] p-1 sm:pl-10 sm:pr-7 sm:pb-10">
        <h1 className="text-[2rem] font-bold">Error fetching from server. Try Again.</h1>
      </div>
    );
  }

  return (
    <div className="h-screen bg-muted pt-[calc(var(--nav-height))]">
      <div className="relative flex flex-col lg:flex-row justify-center items-center mt-5">
        <h1 className="text-[3rem] font-bold text-center underline underline-offset-12">
          {userSkill?.skill.name} Journals
        </h1>
        <div className="static lg:absolute lg:right-10 flex gap-x-2 mt-3">
          <Badge
            variant="outline"
            className={`${
              userSkill && CATEGORY_BG_COLORS[userSkill?.skill.category]
            } w-30 h-10 text-[1rem] rounded-full`}
          >
            {userSkill?.skill.category}
          </Badge>
          <Badge
            variant="outline"
            className={`${userSkill && LEVEL_BG_COLORS[userSkill?.proficiency]} w-30 h-10 text-[1rem] rounded-full`}
          >
            {userSkill?.proficiency}
          </Badge>
        </div>
      </div>
      <Accordion type="multiple" className="bg-muted p-10 flex flex-col gap-8">
        {journals?.results.map((journal) => (
          <AccordionItem
            key={journal.id}
            value={`journal-${journal.id}`}
            className="border rounded-xl bg-card p-4 shadow-sm"
          >
            <AccordionTrigger className="flex-col sm:flex-row justify-between items-center cursor-pointer hover:no-underline">
              <span className="text-left text-xl font-bold">{journal.title}</span>
              <span className="text-sm font-bold sm:ml-auto">
                Created: {new Date(journal.created_at).toLocaleString()}
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-5 pb-2">
              <div className="bg-muted/30 p-4 rounded-md border border-border mt-2 shadow-md">
                <h2 className="text-xl font-semibold mb-1 underline">AI Summary</h2>
                <p className="whitespace-pre-wrap italic text-[0.975rem]">{journal.summary}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => handleView(journal.id, VIEW_MODES.PREVIEW)}>
                  View
                </Button>
                <Button variant="outline" onClick={() => handleView(journal.id, VIEW_MODES.EDIT)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(journal.id)}>
                  Delete
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        <Link
          className="flex justify-center items-center bg-white hover:bg-gray-300 text-black text-[1.2rem] py-6 px-2 rounded text-center font-semibold h-10"
          href={`${pathName}/new?viewMode=${VIEW_MODES.EDIT}`}
        >
          <div className="flex justify-center items-center gap-x-3">
            <PlusCircle /> <span className="text-base sm:text-lg">Create Journal (AI Powered)</span>
          </div>
        </Link>
        {journals && journals.total_pages > 1 && (
          <Pagination className="mt-6 self-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: journals.total_pages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(journals.total_pages, p + 1))}
                  className={page === journals.total_pages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Accordion>
    </div>
  );
}
