import React from "react";
import { JournalList } from "@/components/journals";

export default async function SkillJournalsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug: userSkillId } = await params;

  const sp = await searchParams;
  const pageNumber = Number(sp.page);
  const initialPage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  return <JournalList userSkillId={Number(userSkillId)} initialPage={initialPage} />;
}
