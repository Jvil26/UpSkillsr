import { Skills, skillsSchema } from "@/lib/types";

export async function fetchAllSkills(): Promise<Skills | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/skills/`);
    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedSkills = skillsSchema.parse(resJSON);
    return validatedSkills;
  } catch (error) {
    console.error("Fetch skills Failed ", error);
    throw new Error();
  }
}
