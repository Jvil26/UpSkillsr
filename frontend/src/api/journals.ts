import { Users, usersSchema } from "@/lib/types";

export async function fetchJournalsByUserSkill(username: string): Promise<Users | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/match/${username}`);
    const resJSON = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedJSON = usersSchema.parse(resJSON);
    return validatedJSON;
  } catch (error) {
    console.error("Failed to fetch matched users ", error);
  }
}
