"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { extractYouTubeId } from "@/lib/utils";
import Image from "next/image";

type JournalViewProps = {
  skillName: string;
  isNew?: boolean;
  journal?: {
    id: number;
    user_skill_id: number;
    title: string;
    text_content: string;
    media: string | null;
    youtube_url: string | null;
    created_at: string;
  };
};
export default function JournalView({ skillName, isNew, journal }: JournalViewProps) {
  const [title, setTitle] = useState<string>(journal?.title || "");
  const [textContent, setTextContent] = useState<string>(journal?.text_content || "");
  const [media, setMedia] = useState<File | null>(null);
  const [youtubeURL, setYoutubeURL] = useState<string>(journal?.youtube_url || "");

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) {
      toast.error("Failed to journal. Title cannot be empty");
      return;
    }
    if (!textContent) {
      toast.error("Failed to journal. Content cannot be empty");
      return;
    }
    if (youtubeURL) {
      const url = youtubeURL.trim().toLowerCase();
      if (url && !url.includes("youtube.com") && !url.includes("youtu.be")) {
        toast.error("Failed to journal. Please provide a valid YouTube link or upload a file.");
        return;
      }
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text_content", textContent);
    if (media) formData.append("media", media);
    if (youtubeURL) formData.append("media", youtubeURL);
    try {
      if (isNew) {
        // CREATE NEW JOURNAL
      } else {
        // UPDATE JOURNAL
      }
      toast.success("Journal saved successfully!");
      // TODO: send formData to backend with fetch or axios
      console.log("Saving journal:", formData);
    } catch {
      toast.error("Failed to save journal.");
    }
  };

  return (
    <div className="min-h-screen bg-muted pt-[calc(var(--nav-height))] p-10">
      <h1 className="text-[3rem] mt-5 font-bold text-center underline underline-offset-12">
        {isNew && "New"} {skillName} Journal
      </h1>
      <form onSubmit={(e) => handleSave(e)} className="flex flex-col gap-y-7">
        <div>
          <Label className="pb-1 text-[1.8rem]">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="!text-[1.8rem] py-10 font-bold"
          />
        </div>

        <div>
          <Label className="pb-1 text-[1.8rem]">Content</Label>
          <Textarea
            id="text-content"
            rows={6}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="!text-[1.1rem] min-h-60"
          />
        </div>

        <div>
          <Label className="pb-1 text-[1.8rem]">Upload Media</Label>
          <Input type="file" id="media" accept="image/*,video/*" onChange={handleMediaChange} />
          <div className="flex justify-center">
            {journal?.media ? (
              journal.media.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={journal.media} controls className="w-full h-64 rounded-md mb-5" />
              ) : (
                <Image
                  src={journal.media}
                  alt="Uploaded media"
                  className="w-full max-h-64 rounded-md object-contain mb-5"
                />
              )
            ) : null}
          </div>
        </div>
        <div>
          <Label className="pb-1 text-[1.8rem]">Youtube URL</Label>
          <Input
            id="youtube-url"
            value={youtubeURL || ""}
            onChange={(e) => setYoutubeURL(e.target.value)}
            className="!text-[1rem] mb-5 font-bold py-5"
            placeholder="Youtube URL"
          />
          {journal?.youtube_url && (
            <iframe
              className="w-5/10 h-100 rounded-md border-4 border-border outline outline-1 outline-white"
              src={`https://www.youtube.com/embed/${extractYouTubeId(journal.youtube_url)}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        <div className="flex justify-center items-center mt-5">
          <Button className="text-[1rem] p-5" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
