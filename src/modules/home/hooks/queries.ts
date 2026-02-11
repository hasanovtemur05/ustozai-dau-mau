import { useQuery } from "@tanstack/react-query";
import { getDauWithUsers } from "../service";

export function useGetDauData(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: ["category", pageNumber, pageSize],
    queryFn: () => getDauWithUsers({ pageNumber, pageSize })
  })
}
