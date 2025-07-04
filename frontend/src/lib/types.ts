import { z } from "zod";

export type UserPayload = {
  username: string;
  phone: string;
  gender: string;
  email: string;
  name: string;
};

export type Proficiency = "Beginner" | "Intermediate" | "Advanced";

export type UserSkillsPayload = {
  skill: Skill;
  proficiency: Proficiency;
}[];

export type UpdateUserSkillsPayload = {
  username: string;
  userSkills: UserSkillsPayload;
};

export type CreateUserSkillPayload = {
  user_id: number;
  skill_id: number;
  proficiency: Proficiency;
};

export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const skillsSchema = z.array(skillSchema);

export const journalSchema = z.object({
  id: z.number(),
  user_skill: z.number(),
  title: z.string(),
  text_content: z.string(),
  media: z.string().nullable(),
  youtube_url: z.string().nullable(),
  created_at: z.string(),
});

export const journalsSchema = z.array(journalSchema);

export const userSkillSchema = z.object({
  id: z.number(),
  user: z.number(),
  skill: skillSchema,
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced"]),
  journals: journalsSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
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

export const usersSchema = z.array(userSchema);

export type Users = z.infer<typeof usersSchema>;
export type User = z.infer<typeof userSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type UserSkills = z.infer<typeof userSkillsSchema>;
export type UserSkill = z.infer<typeof userSkillSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Journal = z.infer<typeof journalSchema>;
export type Journals = z.infer<typeof journalsSchema>;
