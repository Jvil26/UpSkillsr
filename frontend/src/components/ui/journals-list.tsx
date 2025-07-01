"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type JournalsListProps = {
  skillName: string;
  journals: {
    id: number;
    user_skill_id: number;
    title: string;
    text_content: string;
    media: string | null;
    created_at: string;
  }[];
};

export default function JournalsList({ skillName, journals }: JournalsListProps) {
  const router = useRouter();
  const pathName = usePathname();

  const handleDelete = (id: number) => {
    // implement delete logic here
    console.log("Delete journal", id);
  };

  const handleView = (journal: (typeof journals)[number]) => {
    // e.g., open a modal or route to full view
    console.log("View journal", journal);
    router.push(`${pathName}/${journal.id}`);
  };

  return (
    <div className="h-screen bg-muted pt-[calc(var(--nav-height))]">
      <h1 className="text-[3rem] mt-5 font-bold text-center underline underline-offset-12">{skillName} Journals</h1>
      <Accordion type="multiple" className="bg-muted p-10 flex flex-col gap-8">
        {journals.map((journal) => (
          <AccordionItem
            key={journal.id}
            value={`journal-${journal.id}`}
            className="border rounded-xl bg-card p-4 shadow-sm"
          >
            <AccordionTrigger className="justify-between cursor-pointer hover:no-underline">
              <span className="text-left text-xl font-bold">{journal.title}</span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-5 pb-2">
              <p className="text-sm">{journal.text_content.slice(0, 100)}...</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => handleView(journal)}>
                  View
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(journal.id)}>
                  Delete
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        <Link
          className="flex justify-center items-center bg-green-700 hover:bg-green-800 text-[1.2rem] py-6 px-2 text-white rounded text-center font-bold h-10"
          href={`${pathName}/new`}
        >
          <span>Create Journal</span>
        </Link>
      </Accordion>
    </div>
  );
}
