"use client";

import { useState, useEffect } from "react";
import { ViewMode } from "@/lib/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { VIEW_MODES } from "@/lib/const";
import Link from "next/link";

type JournalViewProps = {
  title: string;
  textContent: string;
  media: File | string | null | undefined;
  summary: string | null;
  resourceLinks: { type: string; title: string; url: string }[];
  createdAt: string | undefined;
  onViewChange?: (viewMode: ViewMode) => void;
};

export default function JournalView({
  onViewChange,
  title,
  textContent,
  media,
  summary,
  resourceLinks,
  createdAt,
}: JournalViewProps) {
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!media) {
      setPreviewMediaUrl(null);
      return;
    }
    if (typeof media == "string") {
      setPreviewMediaUrl(media);
      return;
    }

    const objectUrl = URL.createObjectURL(media);
    setPreviewMediaUrl(objectUrl);

    // Cleanup when media changes or component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [media]);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto mt-7 border border-border rounded-xl p-6 shadow-xl bg-muted">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        {onViewChange && (
          <div className="flex justify-end px-6">
            <Button className="px-6" onClick={() => onViewChange(VIEW_MODES.EDIT)}>
              {VIEW_MODES.EDIT}
            </Button>
          </div>
        )}
      </div>
      {createdAt && <p className="text-muted-foreground">Created At: {new Date(createdAt).toLocaleString()}</p>}
      <div>
        <p className="whitespace-pre-wrap leading-relaxed mt-6 font-serif text-[1.05rem]">{textContent}</p>
      </div>
      {summary && (
        <div className="bg-muted/30 p-4 rounded-md border border-border mt-6 shadow-md">
          <h2 className="text-xl font-semibold mb-1 underline">AI Summary</h2>
          <p className="whitespace-pre-wrap text-[0.975rem] font-serif">{summary}</p>{" "}
        </div>
      )}
      {previewMediaUrl && (
        <div>
          <h2 className="text-xl font-semibold my-3 underline">Attached Media</h2>
          {previewMediaUrl ? (
            previewMediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={previewMediaUrl} controls className="w-full h-64 rounded-md my-3" />
            ) : (
              <div className="relative w-full max-w-[800px] h-50 sm:h-100 my-3">
                <Image
                  src={previewMediaUrl}
                  alt="Journal media"
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 800px"
                  className="rounded-md object-contain"
                />
              </div>
            )
          ) : null}
        </div>
      )}
      {resourceLinks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 underline underline-offset-4">Resources</h2>
          <ul className="grid gap-4">
            {resourceLinks.map((link, index) => (
              <li
                key={index}
                className="border border-border rounded-xl p-4 bg-muted/10 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {link.type}
                    </span>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-blue-600 hover:underline break-words"
                    >
                      {link.title}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-blue-600"
                    >
                      View &rarr;
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
