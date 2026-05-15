import { useQuery } from "@tanstack/react-query";
import { getStatement } from "@/services/api/transactions";
import type { StatementFilter } from "@/types/api";

export function useStatement(filter: StatementFilter) {
  return useQuery({
    queryKey: ["transactions", "statement", filter],
    queryFn: () => getStatement(filter),
    placeholderData: (prev) => prev,
  });
}
