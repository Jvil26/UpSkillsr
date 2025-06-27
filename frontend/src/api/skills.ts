import { Skills, skillsSchema } from "@/lib/types";

export async function fetchAllSkills(): Promise<Skills | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/skills/`);
    if (!res.ok) {
      throw new Error("Failed to fetch skills");
    }
    const resJSON = await res.json();
    const validatedSkills = skillsSchema.parse(resJSON);
    return validatedSkills;
  } catch (error) {
    console.error("Fetch skills Failed ", error);
  }
}
