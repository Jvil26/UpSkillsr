import { Suspense } from "react";
import { JournalList } from "@/components/journals";

export default function JournalsPage() {
  return (
    <Suspense>
      <JournalList />
    </Suspense>
  );
}
