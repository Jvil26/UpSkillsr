import { z } from "zod";

export type ViewMode = "Edit" | "Preview";

export type UserPayload = {
  username: string;
  phone: string;
  gender: string;
  email: string;
  name: string;
};

export type Proficiency = "Beginner" | "Intermediate" | "Advanced";

export type UserSkillPayload = {
  user_id: string;
  skill_id: number;
  proficiency: Proficiency;
};

export type Prompts = {
  question: string;
  answer: string;
}[];

export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
});

export const skillsSchema = z.array(skillSchema);

export const resourceLinkSchema = z.object({
  id: z.number(),
  journal: z.number(),
  title: z.string(),
  url: z.string(),
  type: z.string(),
  created_at: z.string(),
});

export const resourceLinksSchema = z.array(resourceLinkSchema);

export const userSkillSchema = z.object({
  id: z.number(),
  user: z.number(),
  skill: skillSchema,
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced"]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const journalSchema = z.object({
  id: z.number(),
  user_skill: userSkillSchema,
  title: z.string(),
  text_content: z.string(),
  media: z.string().nullable(),
  summary: z.string().nullable(),
  prompts: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
  resource_links: resourceLinksSchema,
  updated_at: z.string(),
  created_at: z.string(),
});

export const journalsSchema = z.array(journalSchema);

export const paginatedJournalsSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total: z.number(),
  results: journalsSchema,
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

export const filtersSchema = z.object({
  search: z.string(),
  sort: z.string(),
  proficiency: z.string(),
});

export type Users = z.infer<typeof usersSchema>;
export type User = z.infer<typeof userSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type UserSkills = z.infer<typeof userSkillsSchema>;
export type UserSkill = z.infer<typeof userSkillSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Journal = z.infer<typeof journalSchema>;
export type Journals = z.infer<typeof journalsSchema>;
export type ResourceLink = z.infer<typeof resourceLinkSchema>;
export type ResourceLinks = z.infer<typeof resourceLinksSchema>;
export type PaginatedJournals = z.infer<typeof paginatedJournalsSchema>;
export type Filters = z.infer<typeof filtersSchema>;
