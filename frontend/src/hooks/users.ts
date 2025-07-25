import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createUser,
  fetchBackendUser,
  fetchUserSkills,
  createUserSkills,
  createUserSkill,
  updateUserSkillById,
  updateUserProfilePic,
  fetchUserSkillById,
  updateUserProfileById,
  deleteUserSkillById,
} from "@/api/users";
import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { User, UserPayload, UserProfile, UserSkills, UserSkill, UserSkillPayload } from "@/lib/types";
import { useAuthContext } from "@/context/auth";

export function useCreateOrFetchUser(): UseMutationResult<User | undefined, Error, UserPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["backendUser", user?.username], user);
    },
  });
}

export function useFetchUser(): UseQueryResult<User | undefined> {
  const { user } = useAuthContext();
  const username = user?.username;

  return useQuery({
    queryKey: ["backendUser", username],
    queryFn: () => fetchBackendUser(username!),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateUserProfileById(): UseMutationResult<
  User | undefined,
  Error,
  { id: number; updatedProfile: Partial<UserProfile> }
> {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const username = user?.username;
  return useMutation({
    mutationFn: ({ id, updatedProfile }) => updateUserProfileById(id, updatedProfile),
    onSuccess: (updatedUser) => {
      if (username) {
        queryClient.setQueryData(["backendUser", username], updatedUser);
      }
    },
  });
}

export function useFetchUserSkills(): UseQueryResult<UserSkills | undefined> {
  const { user } = useAuthContext();
  const username = user?.username;

  return useQuery({
    queryKey: ["userSkills", username],
    queryFn: () => fetchUserSkills(username!),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateUserSkills(): UseMutationResult<UserSkills | undefined, Error, UserSkills> {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const username = user?.username;

  return useMutation({
    mutationFn: createUserSkills,
    onSuccess: (newSkills) => {
      if (username && newSkills) {
        queryClient.setQueryData(["userSkills", username], (oldUserSkills: UserSkills | undefined) => {
          if (!oldUserSkills) return newSkills;
          return [...oldUserSkills, ...newSkills];
        });
      }
    },
  });
}

export function useCreateUserSkill(): UseMutationResult<UserSkill | undefined, Error, UserSkillPayload> {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const username = user?.username;

  return useMutation({
    mutationFn: createUserSkill,
    onSuccess: (newSkill) => {
      if (username && newSkill) {
        queryClient.setQueryData(["userSkills", username], (oldUserSkills: UserSkills | undefined) => {
          if (!oldUserSkills) return [newSkill];
          return [...oldUserSkills, newSkill];
        });
      }
    },
  });
}

export function useUpdateUserSkillById(): UseMutationResult<
  UserSkill | undefined,
  Error,
  { id: number; data: UserSkillPayload }
> {
  const { user } = useAuthContext();
  const username = user?.username;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUserSkillById(id, data),
    onSuccess: (updatedSkill) => {
      if (username && updatedSkill) {
        queryClient.setQueryData(["userSkills", username], (oldUserSkills: UserSkills | undefined) => {
          if (!oldUserSkills) return undefined;
          const updatedUserSkills = oldUserSkills.map((us) => (us.id === updatedSkill.id ? updatedSkill : us));
          return updatedUserSkills;
        });
      }
    },
  });
}

export function useDeleteUserSkillById(): UseMutationResult<number | undefined, Error, number> {
  const { user } = useAuthContext();
  const username = user?.username;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserSkillById,
    onSuccess: (deletedId) => {
      if (username && deletedId) {
        queryClient.setQueryData(["userSkills", username], (oldUserSkills: UserSkills | undefined) => {
          if (!oldUserSkills) return oldUserSkills;
          return oldUserSkills.filter((us) => us.id !== deletedId);
        });
      }
    },
  });
}

export function useFetchUserSkillById(id: number | undefined): UseQueryResult<UserSkill | undefined> {
  return useQuery({
    queryKey: ["userSkill", id],
    queryFn: () => fetchUserSkillById(id!),
    enabled: typeof id === "number",
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateUserProfilePic(): UseMutationResult<
  User | undefined,
  Error,
  { userProfileId: number; file: File }
> {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const username = user?.username;

  return useMutation({
    mutationFn: updateUserProfilePic,
    onSuccess: (updatedUser) => {
      if (username) {
        queryClient.setQueryData(["backendUser", username], updatedUser);
      }
    },
  });
}
