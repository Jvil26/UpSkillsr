import { useQuery, UseQueryResult, UseMutationResult, useMutation } from "@tanstack/react-query";
import { createJournal, deleteJournalById, fetchJournalById, updateJournalById } from "@/api/journals";
import { Journal, UserSkill } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export function useFetchJournalById(id: number, options?: { enabled?: boolean }): UseQueryResult<Journal | undefined> {
  return useQuery({
    queryKey: options?.enabled ? ["journal", id] : ["journal"],
    queryFn: () => fetchJournalById(id!),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateJournal(userSkillId: number): UseMutationResult<Journal | undefined, Error, FormData> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournal,
    onSuccess: (newJournal) => {
      if (newJournal) {
        queryClient.setQueryData(["journal", newJournal.id], newJournal);
        queryClient.invalidateQueries({ queryKey: ["userSkill", userSkillId] });
      }
    },
  });
}

export function useUpdateJournalById(
  userSkillId: number
): UseMutationResult<Journal | undefined, Error, { id: number; journalData: FormData }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJournalById,
    onSuccess: (updatedJournal) => {
      if (updatedJournal) {
        queryClient.setQueryData(["journal", updatedJournal.id], updatedJournal);
        queryClient.invalidateQueries({ queryKey: ["userSkill", userSkillId] });
      }
    },
  });
}

export function useDeleteJournalById(userSkillId: number): UseMutationResult<number | undefined, Error, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJournalById,
    onSuccess: (deletedId) => {
      if (deletedId) {
        queryClient.invalidateQueries({ queryKey: ["journal", deletedId] });
        queryClient.setQueryData(["userSkill", userSkillId], (oldData: UserSkill) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            journals: oldData.journals.filter((j) => j.id !== deletedId),
          };
        });
      }
    },
  });
}
