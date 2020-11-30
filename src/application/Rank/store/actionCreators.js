import { fromJS } from 'immutable'
import {
	CHANGE_LOADING,
	CHANGE_RANK_LIST
} from './constants.js'
import { getRankListRequest } from '../../../api/request.js'

//actionCrreator
const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data)
})

const changeLoading = (data) => ({
  type: CHANGE_LOADING,
  data
})

export const getRankList = () => {
  return dispatch => {
    getRankListRequest().then(data => {
      let list = data && data.list;
      dispatch(changeRankList(list));
      dispatch(changeLoading(false));
    })
  }
}