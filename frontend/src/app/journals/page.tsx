import { Suspense } from "react";
import { JournalList } from "@/components/journals";

export default async function JournalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const pageNumber = Number(sp.page);
  const initialPage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  return (
    <Suspense>
      <JournalList initialPage={initialPage} />
    </Suspense>
  );
}
