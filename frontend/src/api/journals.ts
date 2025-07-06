import { Journal, journalSchema } from "@/lib/types";
import { z } from "zod";

export async function fetchJournalById(id: number): Promise<Journal | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journals/${id}/`);
    const resJSON = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedJournalJSON = journalSchema.parse(resJSON);
    return validatedJournalJSON;
  } catch (error) {
    console.error(`Failed to fetch journal by id: ${id}`, error);
  }
}

export async function createJournal(journalData: FormData): Promise<Journal | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journals/`, {
      method: "POST",
      body: journalData,
    });
    const resJSON = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedJournalJSON = journalSchema.parse(resJSON);
    return validatedJournalJSON;
  } catch (error) {
    console.error("Failed to create journal", error);
    throw new Error();
  }
}

export async function updateJournalById({
  id,
  journalData,
}: {
  id: number;
  journalData: FormData;
}): Promise<Journal | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journals/${id}/`, {
      method: "PUT",
      body: journalData,
    });
    const resJSON = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedJournalJSON = journalSchema.parse(resJSON);
    return validatedJournalJSON;
  } catch (error) {
    console.error(`Failed to update journal by id: ${id}`, error);
    throw new Error();
  }
}

export async function deleteJournalById(id: number): Promise<number | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journals/${id}/`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const resJSON = await res.json();
      throw new Error(JSON.stringify(resJSON));
    }

    return id;
  } catch (error) {
    console.error(`Failed to delete journal by id: ${id}`, error);
    throw new Error();
  }
}

export async function generateJournalSummary(textContent: string): Promise<string> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journals/generate-summary/`, {
      method: "POST",
      body: JSON.stringify({ textContent }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const summary = resJSON.summary;
    console.log(resJSON);
    const validatedSummary = z.string().parse(summary);
    return validatedSummary;
  } catch (error) {
    console.error(`Failed to generate journal summary`, error);
    throw new Error();
  }
}
