import { axiosInstance } from './config.js'

// 轮播图内容
export const getBannerRequest = () => {
	return axiosInstance.get("/banner")
}

// 推荐内容
export const getRecommendListRequest = () => {
	return axiosInstance.get("/personalized")
}

// 热门歌手列表
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
}

// 获取歌手列表
export const getSingerListRequest= (type, area, alpha, count) => {
  return axiosInstance.get(`/artist/list?type=${type}&area=${area}&initial=${alpha? alpha.toLowerCase(): ''}&offset=${count}`);
}