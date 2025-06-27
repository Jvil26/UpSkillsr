import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createUser, fetchBackendUser, updateUserProfile, createUserSkills, updateUserSkills } from "@/api/users";
import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { User, UserPayload, UserProfile, UserSkills, UpdateUserSkillsPayload } from "@/lib/types";

export function useCreateOrFetchUser(): UseMutationResult<User | undefined, Error, UserPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["backendUser", user?.username], user);
    },
  });
}

export function useFetchUser(username: string): UseQueryResult<User | undefined> {
  return useQuery({
    queryKey: ["backendUser", username],
    queryFn: () => fetchBackendUser(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateUserProfile(): UseMutationResult<
  UserProfile | undefined,
  Error,
  { updatedProfile: UserProfile; username: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ updatedProfile }) => updateUserProfile(updatedProfile),
    onSuccess: (_, { username }) => {
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["backendUser", username] });
      }
    },
  });
}

export function useCreateUserSkills(): UseMutationResult<
  UserSkills | undefined,
  Error,
  { userSkills: UserSkills; username: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userSkills }) => createUserSkills(userSkills),
    onSuccess: (_, { username }) => {
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["backendUser", username] });
      }
    },
  });
}

export function useUpdateUserSkills(): UseMutationResult<boolean, Error, UpdateUserSkillsPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserSkills,
    onSuccess: (_, { username }) => {
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["backendUser", username] });
      }
    },
  });
}
