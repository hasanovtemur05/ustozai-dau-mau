import { useQuery } from "@tanstack/react-query";
import { getDauWithUsers, getDauGeneralStats, getMrr, getDauMouStatistics } from "../service";

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


// =====================================  USE GET DAU/MAU VIEWS DAILY ================================================
export function useGetViewsDaily(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["viewsStats", startDate, endDate],
    queryFn: () => getDauMouStatistics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}