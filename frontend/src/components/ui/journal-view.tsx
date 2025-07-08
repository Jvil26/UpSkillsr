"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { extractYouTubeId } from "@/lib/utils";
import Image from "next/image";

type JournalViewProps = {
  title: string;
  textContent: string;
  media: string | null | undefined;
  youtubeURL: string;
  summary: string;
  isGeneratingSummary: boolean;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTextContent: React.Dispatch<React.SetStateAction<string>>;
  setYoutubeURL: React.Dispatch<React.SetStateAction<string>>;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  onMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateSummary: () => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function JournalView({
  title,
  textContent,
  media,
  youtubeURL,
  summary,
  isGeneratingSummary,
  setTitle,
  setTextContent,
  setYoutubeURL,
  setSummary,
  onMediaChange,
  onGenerateSummary,
  onSave,
}: JournalViewProps) {
  return (
    <div className="w-full mt-5 p-5 sm:px-10 sm:pb-10 border border-border border-white rounded-md overflow-y-auto">
      <form onSubmit={(e) => onSave(e)} className="flex flex-col gap-y-4">
        <div>
          <Label className="pb-1 text-[1.1rem]">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="!text-[1rem] py-6 sm:py-8 md:py-7 font-bold"
          />
        </div>

        <div>
          <Label className="pb-1 text-[1.1rem]">Content</Label>
          <Textarea
            id="text-content"
            rows={6}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Type your journal content here"
            className="!text-[1rem] min-h-50 resize-none h-fit"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-end justify-between">
            <Label className="text-[1.1rem]">Summary</Label>
            <Button
              type="button"
              size="sm"
              className="text-sm"
              onClick={onGenerateSummary}
              disabled={isGeneratingSummary || !textContent}
            >
              {isGeneratingSummary ? "Generating..." : "Generate AI Summary"}
            </Button>
          </div>

          <Textarea
            id="summary"
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="!text-[1rem] min-h-40 h-fit mt-2 resize-none"
            placeholder="AI-generated summary will appear here"
          />
        </div>

        <div>
          <Label className="pb-1 text-[1.1rem]">Upload Media</Label>
          <Input type="file" id="media" accept="image/*,video/*" onChange={onMediaChange} />
          <div className="flex justify-center">
            {media ? (
              media.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={media} controls className="w-full h-64 rounded-md my-3" />
              ) : (
                <div className="relative w-full max-w-[800px] h-50 sm:h-100 my-3">
                  <Image
                    src={media}
                    alt="Uploaded media"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 800px"
                    className="rounded-md object-contain"
                  />
                </div>
              )
            ) : null}
          </div>
        </div>
        <div>
          <Label className="pb-1 text-[1.1rem]">Youtube URL</Label>
          <Input
            id="youtube-url"
            value={youtubeURL}
            onChange={(e) => setYoutubeURL(e.target.value)}
            className="!text-[1rem] mb-2 font-bold py-5"
            placeholder="Paste Youtube URL Here"
          />
          {youtubeURL && (youtubeURL.includes("youtube.com") || youtubeURL.includes("youtu.be")) && (
            <div className="flex justify-center">
              <iframe
                className="w-full lg:w-3/4 h-90 rounded-md border-4 border-border outline outline-1 outline-white mt-2"
                src={`https://www.youtube.com/embed/${extractYouTubeId(youtubeURL)}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
