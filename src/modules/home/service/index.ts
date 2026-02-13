import axiosInstance from "../../../api"

type ParamsType = {
  pageNumber: number
  pageSize: number
  sortBy: 'streakCount' | 'launchCount' 
  order: 'asc' | 'desc'
}


// ==============================================  GET TOP USERS =======================================
export const getDauWithUsers = async ({pageNumber, pageSize, sortBy, order}:ParamsType ) => {
  const response = await axiosInstance.get(`statistics/dau/with-users`,{params: { pageNumber, pageSize, sortBy, order }})
  return response?.data
}


// ===========================================  GET DAU MAU START DATE END DATE =======================================
export const getDauGeneralStats = async (startDate: string, endDate: string) => {
  const response = await axiosInstance.get(`statistics/dau/general-stats?startDate=${startDate}&endDate=${endDate}`)
  return response?.data
}



// ========================================  GET MRR  ===============================================
export const getMrr = async ( startDate:string, endDate: string) => {
  const response = await axiosInstance.get(`statistics/transactions/by-provider-date?startDate=${startDate}&endDate=${endDate}`)
  return response?.data?.data
}