import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Person, PersonId } from "@/lib/api/types";

export function usePeople() {
  return useQuery({
    queryKey: ["people"] as const,
    queryFn: () => apiGet<Person[]>("/people"),
    // Identity records rarely change — cache aggressively.
    staleTime: 5 * 60_000,
  });
}

export function indexPeople(people: Person[] | undefined): Map<PersonId, Person> {
  return new Map((people ?? []).map((p) => [p.id, p]));
}
