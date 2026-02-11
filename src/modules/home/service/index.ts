import axiosInstance from "../../../api"

type ParamsType = {
  pageNumber: number
  pageSize: number
}

export const getDauWithUsers = async ({pageNumber, pageSize}:ParamsType ) => {
  const response = await axiosInstance.get(`statistics/dau/with-users`,{params: { pageNumber, pageSize }})
  return response.data
}
