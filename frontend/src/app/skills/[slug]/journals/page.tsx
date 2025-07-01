import React from "react";
import JournalsList from "@/components/ui/journals-list";

export default async function SkillJournalsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: skillName } = await params;
  const journals = [
    {
      id: 1,
      user_skill_id: 1,
      title: "Intro to Lists",
      text_content: "Practiced list creation, indexing, and basic methods like append and pop.",
      media: null,
      created_at: "2025-06-30T10:00:00Z",
    },
    {
      id: 2,
      user_skill_id: 1,
      title: "Functions Refresher",
      text_content: "Wrote several small functions to solidify understanding of parameters and return values.",
      media: null,
      created_at: "2025-06-30T12:00:00Z",
    },
    {
      id: 3,
      user_skill_id: 2,
      title: "React Hooks Overview",
      text_content: "Took notes on useState, useEffect, and useRef with sample components.",
      media: null,
      created_at: "2025-06-29T09:00:00Z",
    },
    {
      id: 4,
      user_skill_id: 3,
      title: "Joins Practice",
      text_content: "Practiced INNER JOINs and LEFT JOINs on sample data sets.",
      media: null,
      created_at: "2025-06-28T15:00:00Z",
    },
  ];

  return <JournalsList skillName={skillName} journals={journals} />;
}
