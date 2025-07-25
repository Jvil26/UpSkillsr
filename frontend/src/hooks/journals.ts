import { useQuery, UseQueryResult, UseMutationResult, useMutation } from "@tanstack/react-query";
import {
  batchUpdateResourceLinks,
  createJournal,
  deleteJournalById,
  fetchAllJournals,
  fetchJournalById,
  fetchJournalsByUserSkillId,
  generateJournal,
  generateJournalSummary,
  updateJournalById,
} from "@/api/journals";
import { Filters, Journal, PaginatedJournals, Prompts, ResourceLink, ResourceLinks } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/auth";

export function useFetchAllJournals(
  page: number,
  filters: Filters,
  options?: { enabled?: boolean }
): UseQueryResult<PaginatedJournals | undefined> {
  const { user } = useAuthContext();
  const username = user?.username;

  return useQuery({
    queryKey: ["paginatedJournals", username, page, filters.search, filters.proficiency, filters.sort],
    queryFn: () => fetchAllJournals(page, filters),
    enabled: options?.enabled ?? false,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("Invalid page")) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useFetchJournalById(id: number, options?: { enabled?: boolean }): UseQueryResult<Journal | undefined> {
  return useQuery({
    queryKey: options?.enabled ? ["journal", id] : ["journal"],
    queryFn: () => fetchJournalById(id!),
    enabled: options?.enabled ?? false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFetchJournalsByUserSkillId(
  id: number | undefined,
  page: number,
  filters: Filters
): UseQueryResult<PaginatedJournals | undefined> {
  return useQuery({
    queryKey: !!id
      ? ["paginatedJournals", id, page, filters.search, filters.proficiency, filters.sort]
      : ["paginatedJournals", page, filters.search, filters.proficiency, filters.sort],
    queryFn: () => fetchJournalsByUserSkillId(id!, page, filters),
    enabled: typeof id === "number",
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("Invalid page")) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useCreateJournal(): UseMutationResult<Journal | undefined, Error, FormData> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournal,
    onSuccess: (newJournal) => {
      if (newJournal) {
        queryClient.invalidateQueries({
          predicate: (query) => {
            return (
              Array.isArray(query.queryKey) &&
              query.queryKey[0] === "paginatedJournals" &&
              query.queryKey[1] == newJournal.user_skill.id
            );
          },
        });
        queryClient.setQueryData(["journal", newJournal.id], newJournal);
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
  const { user } = useAuthContext();
  const username = user?.username;

  return useMutation({
    mutationFn: updateJournalById,
    onSuccess: (updatedJournal) => {
      if (updatedJournal) {
        queryClient.setQueriesData(
          {
            predicate: (query) => {
              return (
                Array.isArray(query.queryKey) &&
                query.queryKey[0] === "paginatedJournals" &&
                (query.queryKey[1] == updatedJournal.user_skill.id || query.queryKey[1] == username)
              );
            },
          },
          (pageData: PaginatedJournals | undefined) => {
            if (!pageData) return undefined;
            return {
              ...pageData,
              results: pageData.results.map((j) => (j.id === updatedJournal.id ? updatedJournal : j)),
            };
          }
        );
        queryClient.setQueryData(["journal", updatedJournal.id], (oldData: Journal | undefined) => {
          if (!oldData) return oldData;
          return updatedJournal;
        });
      }
    },
  });
}

export function useDeleteJournalById(
  userSkillId: number | undefined
): UseMutationResult<number | undefined, Error, number> {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const username = user?.username;

  return useMutation({
    mutationFn: deleteJournalById,
    onSuccess: (deletedId) => {
      if (deletedId) {
        queryClient.invalidateQueries({
          predicate: (query) => {
            return (
              (Array.isArray(query.queryKey) &&
                query.queryKey[0] === "paginatedJournals" &&
                query.queryKey[1] == userSkillId) ||
              query.queryKey[1] == username
            );
          },
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
        console.log(journalId, updatedResourceLinks);
        return {
          ...oldData,
          resource_links: updatedResourceLinks,
        };
      });
    },
  });
}
