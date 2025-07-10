"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useFetchUserSkillById } from "@/hooks/users";
import { useDeleteJournalById } from "@/hooks/journals";
import { Loader2, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_BG_COLORS, LEVEL_BG_COLORS, VIEW_MODES } from "@/lib/const";
import { ViewMode } from "@/lib/types";

type JournalsListProps = {
  userSkillId: number;
};

export default function JournalsList({ userSkillId }: JournalsListProps) {
  const { data: userSkill, isFetching: isFetchingData } = useFetchUserSkillById(userSkillId);
  const { mutate: deleteJournalById } = useDeleteJournalById(userSkillId);

  const router = useRouter();
  const pathName = usePathname();

  const handleDelete = (id: number) => {
    deleteJournalById(id);
  };

  const handleView = (journalId: number, view: ViewMode) => {
    router.push(`${pathName}/${journalId}?viewMode=${encodeURIComponent(view)}`);
  };

  return (
    <div className="h-screen bg-muted pt-[calc(var(--nav-height))]">
      {isFetchingData ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
      ) : (
        <>
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
            {userSkill?.journals
              .slice()
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((journal) => (
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
                    <p className="text-sm">{journal.text_content.slice(0, 200)}...</p>
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
              href={`${pathName}/new`}
            >
              <div className="flex justify-center items-center gap-x-3">
                <PlusCircle /> <span className="text-base sm:text-lg">Create Journal (AI Powered)</span>
              </div>
            </Link>
          </Accordion>
        </>
      )}
    </div>
  );
}
