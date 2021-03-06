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
  return axiosInstance.get(`/top/artists?offset=${count * 50}`);
}

// 获取歌手列表
export const getSingerListRequest= (type, area, alpha, count) => {
  return axiosInstance.get(`/artist/list?type=${type}&area=${area}&initial=${alpha? alpha.toLowerCase(): ''}&offset=${count * 30}`);
}

// 排行榜内容摘要
export const getRankListRequest = () => {
  return axiosInstance.get (`/toplist/detail`);
};

// 歌单详情内容
export const getAlbumDetailRequest = (id) => {
  return axiosInstance.get(`/playlist/detail?id=${id}`)
}

// 歌手详情
export const getSingerInfoRequest = id => {
  return axiosInstance.get(`/artists?id=${id}`);
};