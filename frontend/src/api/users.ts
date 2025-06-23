interface UserPayload {
  username: string;
  phone: string;
  gender: string;
  email: string;
  name: string;
}

export async function createUser(userData: UserPayload) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch or create user");
  }
  const resJSON = await res.json();
  return resJSON;
}

export async function fetchBackendUser(username: string) {
  if (!username) {
    throw new Error("Must specify username.");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${username}`);
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  const resJSON = await res.json();
  return resJSON;
}
