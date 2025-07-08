import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { fetchAuthSession } from "aws-amplify/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
export function formatPhoneNumber(phoneNumberString: string | undefined) {
  if (phoneNumberString) {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
  }
  return "";
}

export function extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

async function getJWTToken(): Promise<string | undefined> {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.accessToken.toString();
  } catch (error) {
    console.error("Failed to fetch jwt token", error);
    return undefined;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getJWTToken();

  const authHeaders = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers: authHeaders,
  });
}
