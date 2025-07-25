"use client";
import { useState } from "react";
import { useDebounce } from "use-debounce";
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
import JournalFilters from "./journal-filters";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFetchUserSkillById } from "@/hooks/users";
import { useDeleteJournalById, useFetchJournalsByUserSkillId, useFetchAllJournals } from "@/hooks/journals";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_BG_COLORS, LEVEL_BG_COLORS, VIEW_MODES } from "@/lib/const";
import { ViewMode, Filters } from "@/lib/types";

type JournalsListProps = {
  userSkillId?: number;
  initialPage?: number;
};

export default function JournalList({ userSkillId, initialPage = 1 }: JournalsListProps) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    sort: "newest_to_oldest",
    proficiency: "",
  });
  const debouncedSearch = useDebounce(filters.search, 500)[0];
  const [page, setPage] = useState<number>(initialPage);

  const { data: userSkill, isError: isErrorFetchingUserSkill } = useFetchUserSkillById(userSkillId);
  const {
    data: journalsBySkill,
    isError: isErrorBySkill,
    error: errorBySkill,
  } = useFetchJournalsByUserSkillId(userSkillId, page, { ...filters, search: debouncedSearch });
  const {
    data: allJournals,
    isError: isErrorAll,
    error: errorAll,
  } = useFetchAllJournals(page, { ...filters, search: debouncedSearch }, { enabled: !userSkillId });

  const journals = userSkillId ? journalsBySkill : allJournals;
  const isError = isErrorBySkill || isErrorAll;
  const error = errorBySkill || errorAll;

  const { mutate: deleteJournalById } = useDeleteJournalById(userSkillId);

  const handleFilterChange = (updated: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    const paramsString = newPage > 1 ? `?${params.toString()}` : "";
    router.push(`${pathName}${paramsString}`);
  };

  const handleDelete = (id: number) => {
    deleteJournalById(id);
  };

  const handleView = (journalUserSkillId: number, journalId: number, viewMode: ViewMode) => {
    router.push(`/skills/${journalUserSkillId}/journals/${journalId}?viewMode=${encodeURIComponent(viewMode)}`);
  };

  if (isError) {
    if (error?.message.includes("Invalid page")) {
      console.error("Redirecting because:", error.message);
      router.replace("/404");
    }
  }

  if (isErrorFetchingUserSkill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted pt-[calc(var(--nav-height))] p-1 sm:pl-10 sm:pr-7 sm:pb-10">
        <h1 className="text-[2rem] font-bold">Error fetching from server. Try Again.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-auto bg-muted py-[calc(var(--nav-height))] px-35">
      <h1 className="text-[3rem] font-bold text-center underline underline-offset-12 my-6">
        {userSkill?.skill.name} Journals
      </h1>
      <JournalFilters filters={filters} onChange={handleFilterChange} />
      <Accordion type="multiple" className="bg-muted py-5 flex flex-col gap-8">
        {journals?.results.map((journal) => (
          <AccordionItem
            key={journal.id}
            value={`journal-${journal.id}`}
            className="border rounded-xl bg-card p-4 shadow-sm"
          >
            <AccordionTrigger className="flex-col sm:flex-row justify-between items-center cursor-pointer hover:no-underline">
              <span className="text-left text-xl font-bold">{journal.title}</span>
              <div className="sm:ml-auto flex flex-col sm:flex-row items-center">
                <div className="flex flex-col sm:flex-row gap-y-10 mr-6 gap-x-2">
                  <Badge
                    variant="outline"
                    className={`${
                      LEVEL_BG_COLORS[journal.user_skill.proficiency]
                    } w-27 h-8 text-[0.83rem] rounded-full bg-gray-700 hover:bg-gray-600`}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/skills/${journal.user_skill.id}/journals`);
                    }}
                  >
                    {journal.user_skill.skill.name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${
                      CATEGORY_BG_COLORS[journal.user_skill.skill.category]
                    } w-27 h-8 text-[0.83rem] rounded-full`}
                  >
                    {journal.user_skill.skill.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${
                      LEVEL_BG_COLORS[journal.user_skill.proficiency]
                    } w-27 h-8 text-[0.83rem] rounded-full`}
                  >
                    {journal.user_skill.proficiency}
                  </Badge>
                </div>
                <span className="text-sm font-bold">
                  Created:{" "}
                  {new Date(journal.created_at).toLocaleString([], {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-5 pb-2">
              <div className="bg-muted/30 p-4 rounded-md border border-border mt-2 shadow-md">
                <h2 className="text-xl font-semibold mb-1 underline">AI Summary</h2>
                <p className="whitespace-pre-wrap italic text-[0.975rem]">{journal.summary}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => handleView(journal.user_skill.id, journal.id, VIEW_MODES.PREVIEW)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleView(journal.user_skill.id, journal.id, VIEW_MODES.EDIT)}
                >
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
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: journals.total_pages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={page === i + 1} onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(journals.total_pages, page + 1))}
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
