import React from "react";
import JournalsList from "@/components/ui/journals-list";

export default async function SkillJournalsPage({ params }: { params: Promise<{ slug: number }> }) {
  const { slug: userSkillId } = await params;

  return <JournalsList userSkillId={userSkillId} />;
}
