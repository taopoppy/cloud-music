import { axiosInstance } from './config.js'

// 轮播图内容
export const getBannerRequest = () => {
	return axiosInstance.get("/banner")
}

// 推荐内容
export const getRecommendListRequest = () => {
	return axiosInstance.get("/personalized")
}