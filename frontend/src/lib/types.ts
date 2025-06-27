import { z } from "zod";

export type UserPayload = {
  username: string;
  phone: string;
  gender: string;
  email: string;
  name: string;
};

export type UserSkillsPayload = {
  skill: Skill;
  skillType: "Offered" | "Wanted";
  proficiency: "pro" | "noob" | "" | null;
}[];

export type UpdateUserSkillsPayload = {
  username: string;
  userSkills: UserSkillsPayload;
};

export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const skillsSchema = z.array(skillSchema);

export const userSkillSchema = z.object({
  id: z.number(),
  user: z.number(),
  skill: skillSchema,
  skill_type: z.enum(["Offered", "Wanted"]),
  proficiency: z.enum(["pro", "noob", ""]).nullable(),
  created_at: z.string().datetime(),
  last_updated: z.string().datetime(),
});

export const userSkillsSchema = z.array(userSkillSchema);

export const userProfileSchema = z.object({
  id: z.number(),
  bio: z.string(),
  phone: z.string(),
  profile_pic: z.string().nullable(),
  user_id: z.number(),
  gender: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  name: z.string(),
  profile: userProfileSchema,
  user_skills: z.array(userSkillSchema),
  created_at: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type UserSkills = z.infer<typeof userSkillsSchema>;
export type Skill = z.infer<typeof skillSchema>;
