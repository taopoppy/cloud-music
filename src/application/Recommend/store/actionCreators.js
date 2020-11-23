import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { getBannerRequest, getRecommendListRequest } from '../../../api/request.js'

/**
 * 修改轮播图的action
 * @param {Array} data 轮播图数组
 */
export const changeBannerList = (data) => ({
	type: actionTypes.CHANGE_BANNER,
	data: fromJS(data)
})

/**
 * 修改推荐数组的action
 * @param {Array} data 推荐列表数组
 */
export const changeRecommendList = (data) => ({
	type: actionTypes.CHANGE_RECOMMEND_LIST,
	data: fromJS(data)
})

/**
 * 改变加载组件状态的action
 * @param {Boolean} data 是否显示loading组件
 */
export const changeEnterLoading = (data) => ({
	type: actionTypes.CHANGE_ENTER_LOADING,
	data
})


/**
 * 异步请求轮播图数组
 */
export const getBannerList = () => {
	return (dispatch) => {
		getBannerRequest().then(data => {
			dispatch(changeBannerList(data.banners))
		}).catch(err => {
			console.log("轮播图数据传入错误", err)
		})
	}
}

/**
 * 异步请求推荐列表数组
 */
export const getRecommendList = () => {
	return (dispatch) => {
		getRecommendListRequest().then(data => {
			dispatch(changeRecommendList(data.result))
			dispatch(changeEnterLoading(false))
		}).catch(err => {
			console.log("推荐歌单数据传入错误", err)
		})
	}
}