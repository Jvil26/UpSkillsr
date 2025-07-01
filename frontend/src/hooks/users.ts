import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createUser,
  fetchBackendUser,
  updateUserProfile,
  createUserSkills,
  updateUserSkills,
  updateUserProfilePic,
} from "@/api/users";
import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { User, UserPayload, UserProfile, UserSkills, UpdateUserSkillsPayload } from "@/lib/types";
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

export function useUpdateUserProfile(): UseMutationResult<
  User | undefined,
  Error,
  { updatedProfile: Partial<UserProfile>; username: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ updatedProfile }) => updateUserProfile(updatedProfile),
    onSuccess: (user, { username }) => {
      if (username) {
        queryClient.setQueryData(["backendUser", username], user);
      }
    },
  });
}

export function useCreateUserSkills(): UseMutationResult<
  User | undefined,
  Error,
  { userSkills: UserSkills; username: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userSkills }) => createUserSkills(userSkills),
    onSuccess: (user, { username }) => {
      if (username) {
        queryClient.setQueryData(["backendUser", username], user);
      }
    },
  });
}

export function useUpdateUserSkills(): UseMutationResult<User | undefined, Error, UpdateUserSkillsPayload> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserSkills,
    onSuccess: (user, { username }) => {
      if (username) {
        queryClient.setQueryData(["backendUser", username], user);
      }
    },
  });
}

export function useUpdateUserProfilePic(): UseMutationResult<
  User | undefined,
  Error,
  { userProfileId: number; file: File; username: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userProfileId, file }) => updateUserProfilePic({ userProfileId, file }),
    onSuccess: (user, { username }) => {
      if (username) {
        queryClient.setQueryData(["backendUser", username], user);
      }
    },
  });
}
