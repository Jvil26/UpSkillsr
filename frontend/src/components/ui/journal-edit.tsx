"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { VIEW_MODES } from "@/lib/const";
import { ViewMode } from "@/lib/types";

type JournalEditProps = {
  title: string;
  textContent: string;
  media: string | null | undefined;
  summary: string;
  isGeneratingSummary: boolean;
  resourceLinks: { type: string; title: string; url: string }[];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTextContent: React.Dispatch<React.SetStateAction<string>>;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  onMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateSummary: () => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  addResourceLink: () => void;
  updateResourceLink: (index: number, key: string, value: string) => void;
  removeResourceLink: (index: number) => void;
  onViewChange: (viewMode: ViewMode) => void;
};

export default function JournalEdit({
  title,
  textContent,
  media,
  summary,
  isGeneratingSummary,
  resourceLinks,
  setTitle,
  setTextContent,
  setSummary,
  onMediaChange,
  onGenerateSummary,
  onSave,
  addResourceLink,
  updateResourceLink,
  removeResourceLink,
  onViewChange,
}: JournalEditProps) {
  return (
    <div className="w-full mt-5 p-5 sm:px-10 sm:pb-10 border border-border border-white rounded-md overflow-y-auto">
      <div className="flex justify-end">
        <Button className="px-6" onClick={() => onViewChange(VIEW_MODES.PREVIEW)}>
          {VIEW_MODES.PREVIEW}
        </Button>
      </div>
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
          <Label className="pb-1 text-[1.1rem]">Resource Links</Label>
          <div className="flex flex-col gap-y-3">
            {resourceLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border p-3 rounded-md">
                <div>
                  <Label className="mb-1">Type</Label>
                  <select
                    value={link.type}
                    onChange={(e) => updateResourceLink(index, "type", e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 bg-muted"
                  >
                    <option value="">Select Type</option>
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Book">Book</option>
                  </select>
                </div>

                <div>
                  <Label className="mb-1">Title</Label>
                  <Input
                    value={link.title}
                    onChange={(e) => updateResourceLink(index, "title", e.target.value)}
                    placeholder="Resource Title"
                  />
                </div>

                <div>
                  <Label className="mb-1">URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) => updateResourceLink(index, "url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  className="sm:col-span-3 w-fit"
                  onClick={() => removeResourceLink(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" onClick={addResourceLink}>
              + Add Resource Link
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
