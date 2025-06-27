import {
  userSchema,
  User,
  UserPayload,
  UserProfile,
  userProfileSchema,
  UserSkills,
  userSkillsSchema,
  UpdateUserSkillsPayload,
} from "@/lib/types";

export async function createUser(userData: UserPayload): Promise<User | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedUser = userSchema.parse(resJSON);
    return validatedUser;
  } catch (error) {
    console.error("Create User Failed ", error);
  }
}

export async function fetchBackendUser(username: string): Promise<User | undefined> {
  try {
    if (!username) {
      throw new Error("Must specify username.");
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${username}/`);
    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedUser = userSchema.parse(resJSON);
    return validatedUser;
  } catch (error) {
    console.error("Fetch Backend User Failed ", error);
  }
}

export async function updateUserProfile(userProfileData: UserProfile): Promise<UserProfile | undefined> {
  try {
    console.log(userProfileData);
    const { id, ...updatedUserProfile } = userProfileData;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profiles/${id}/`, {
      method: "PUT",
      body: JSON.stringify(updatedUserProfile),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedUserProfile = userProfileSchema.parse(resJSON);
    return validatedUserProfile;
  } catch (error) {
    console.error("Update User Profile Failed ", error);
  }
}

export async function createUserSkills(userSkillsData: UserSkills): Promise<UserSkills | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/skills/`, {
      method: "POST",
      body: JSON.stringify(userSkillsData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create user skills.");
    }
    const resJSON = await res.json();
    const validatedUserSkills = userSkillsSchema.parse(resJSON);
    return validatedUserSkills;
  } catch (error) {
    console.error("Update User Profile Failed ", error);
  }
}

export async function updateUserSkills(data: UpdateUserSkillsPayload): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/skills/sync/`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    return true;
  } catch (error) {
    console.error("Update User Profile Failed ", error);
    return false;
  }
}
