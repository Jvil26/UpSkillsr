import { useQuery, UseQueryResult, UseMutationResult, useMutation } from "@tanstack/react-query";
import {
  batchUpdateResourceLinks,
  createJournal,
  deleteJournalById,
  fetchJournalById,
  generateJournal,
  generateJournalSummary,
  updateJournalById,
} from "@/api/journals";
import { Journal, Prompts, ResourceLink, ResourceLinks, UserSkill } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export function useFetchJournalById(id: number, options?: { enabled?: boolean }): UseQueryResult<Journal | undefined> {
  return useQuery({
    queryKey: options?.enabled ? ["journal", id] : ["journal"],
    queryFn: () => fetchJournalById(id!),
    enabled: options?.enabled ?? false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateJournal(): UseMutationResult<Journal | undefined, Error, FormData> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournal,
    onSuccess: (newJournal) => {
      if (newJournal) {
        queryClient.setQueryData(["journal", newJournal.id], newJournal);
        queryClient.setQueryData(["userSkill", newJournal.user_skill], (oldData: UserSkill | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            journals: [...oldData.journals, newJournal],
          };
        });
      }
    },
  });
}

export function useUpdateJournalById(): UseMutationResult<
  Journal | undefined,
  Error,
  { id: number; journalData: FormData }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJournalById,
    onSuccess: (updatedJournal) => {
      if (updatedJournal) {
        queryClient.setQueryData(["journal", updatedJournal.id], updatedJournal);
        queryClient.setQueryData(["userSkill", updatedJournal.user_skill], (oldData: UserSkill | undefined) => {
          if (!oldData) return oldData;
          const updatedJournals = oldData.journals.map((j) => (updatedJournal.id === j.id ? updatedJournal : j));
          return {
            ...oldData,
            journals: updatedJournals,
          };
        });
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
        queryClient.setQueryData(["userSkill", userSkillId], (oldData: UserSkill | undefined) => {
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

export function useGenerateJournalSummary(): UseMutationResult<string, Error, string> {
  return useMutation({
    mutationFn: generateJournalSummary,
  });
}

export function useGenerateJournal(): UseMutationResult<
  Partial<Journal>,
  Error,
  { prompts: Prompts; userSkillId: number }
> {
  return useMutation({
    mutationFn: ({ userSkillId, prompts }) => generateJournal(userSkillId, prompts),
  });
}

export function useBatchUpdateResourceLinks(): UseMutationResult<
  ResourceLinks,
  Error,
  { journalId: number; resourceLinks: Partial<ResourceLink>[] }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ journalId, resourceLinks }) => batchUpdateResourceLinks(journalId, resourceLinks),
    onSuccess: (updatedResourceLinks, variables) => {
      const { journalId } = variables;
      queryClient.setQueryData(["journal", journalId], (oldData: Journal | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          resource_links: updatedResourceLinks,
        };
      });
    },
  });
}
