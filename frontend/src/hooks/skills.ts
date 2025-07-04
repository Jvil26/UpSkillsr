import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Skills } from "@/lib/types";
import { fetchAllSkills } from "@/api/skills";

export function useFetchAllSkills(): UseQueryResult<Skills | undefined> {
  return useQuery({
    queryKey: ["allSkills"],
    queryFn: () => fetchAllSkills(),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });
}
