import JournalView from "@/components/ui/journal-view";

export default async function JournalPage({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id: journalId, slug: skillName } = await params;

  const journal = {
    id: 3,
    user_skill_id: 2,
    title: "React Hooks Overview",
    text_content: "Took notes on useState, useEffect, and useRef with sample components.",
    media: null,
    youtube_url: "https://www.youtube.com/watch?v=TLvm5y0lup0&ab_channel=Deji2nd",
    created_at: "2025-06-29T09:00:00Z",
  };

  const isNew = journalId === "new";

  return <JournalView skillName={skillName} isNew={isNew} {...(!isNew && journal ? { journal } : {})} />;
}
