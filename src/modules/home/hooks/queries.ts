import { useQuery } from "@tanstack/react-query";
import { getDauWithUsers, getDauGeneralStats, getMrr } from "../service";

// ============================== USE GET DAU WITH USERS ==============================
export function useGetDauData(
  pageNumber: number,
  pageSize: number,
  sortBy: "streakCount" | "launchCount",
  order: "asc" | "desc"
) {
  return useQuery({
    queryKey: ["dauWithUsers", pageNumber, pageSize, sortBy, order],
    queryFn: () => getDauWithUsers({ pageNumber, pageSize, sortBy, order }),
    // keepPreviousData: true,
  });
}

// ============================== USE GET DAU GENERAL STATS ===========================
export function useGetDauGeneralStats(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["dauGeneralStats", startDate, endDate],
    queryFn: () => getDauGeneralStats(startDate, endDate),
    enabled: !!startDate && !!endDate, // agar startDate yoki endDate bo‘lmasa fetch qilinmaydi
  });
}

// ============================== USE GET MRR ========================================
export function useGetMrr(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["mrrStats", startDate, endDate],
    queryFn: () => getMrr(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}
