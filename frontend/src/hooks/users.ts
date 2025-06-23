import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createUser, fetchBackendUser } from "@/api/users";
import { useAuthContext } from "@/context/auth";

export function useCreateOrFetchUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["backendUser", user?.username], user);
    },
  });
}

export function useFetchUser() {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: ["backendUser", user?.username],
    queryFn: () => fetchBackendUser(user!.username),
    enabled: !!user?.username,
  });
}
