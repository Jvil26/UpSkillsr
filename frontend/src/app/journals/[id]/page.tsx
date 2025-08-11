import { JournalCreator } from "@/components/journals";

export default async function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: journalId } = await params;

  const isNew = journalId === "new";

  return (
    <>
      <JournalCreator isNew={isNew} journalId={Number(journalId)} />
    </>
  );
}
