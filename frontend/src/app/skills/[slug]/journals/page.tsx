import React from "react";
import { JournalList } from "@/components/journals";

export default async function SkillJournalsPage({ params }: { params: Promise<{ slug: number }> }) {
  const { slug: userSkillId } = await params;

  return <JournalList userSkillId={userSkillId} />;
}
