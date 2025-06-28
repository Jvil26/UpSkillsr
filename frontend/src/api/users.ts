import { userSchema, User, UserPayload, UserProfile, UserSkills, UpdateUserSkillsPayload } from "@/lib/types";

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

export async function updateUserProfile(userProfileData: Partial<UserProfile>): Promise<User | undefined> {
  try {
    console.log(userProfileData);
    const { id, ...updatedUserProfile } = userProfileData;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profiles/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(updatedUserProfile),
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
    console.error("Update User Profile Failed ", error);
  }
}

export async function createUserSkills(userSkillsData: UserSkills): Promise<User | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/skills/`, {
      method: "POST",
      body: JSON.stringify(userSkillsData),
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
    console.error("Update User Profile Failed ", error);
  }
}

export async function updateUserSkills(data: UpdateUserSkillsPayload): Promise<User | undefined> {
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

    const validatedUser = userSchema.parse(resJSON);
    return validatedUser;
  } catch (error) {
    console.error("Update User Profile Failed ", error);
  }
}

export async function updateUserProfilePic(data: { userProfileId: number; file: File }): Promise<User | undefined> {
  try {
    const { userProfileId, file } = data;
    const formData = new FormData();
    formData.append("profile_pic", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profiles/${userProfileId}/`, {
      method: "PATCH",
      body: formData,
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    const validatedUser = userSchema.parse(resJSON);
    return validatedUser;
  } catch (error) {
    console.error("Update User Profile Failed", error);
  }
}
