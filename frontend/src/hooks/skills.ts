import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Skills } from "@/lib/types";
import { fetchAllSkills } from "@/api/skills";

export function useFetchSkills(): UseQueryResult<Skills | undefined> {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => fetchAllSkills(),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });
}
