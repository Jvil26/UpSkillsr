import JournalView from "@/components/ui/journal-view";

export default async function JournalPage({ params }: { params: Promise<{ id: string; slug: number }> }) {
  const { id: journalId, slug: userSkillId } = await params;

  const isNew = journalId === "new";

  return <JournalView isNew={isNew} journalId={Number(journalId)} userSkillId={userSkillId} />;
}
