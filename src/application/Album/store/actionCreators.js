import { CHANGE_CURRENT_ALBUM, CHANGE_ENTER_LOADING, DELETE_CURRENT_ALBUM } from './constants';
import { getAlbumDetailRequest } from '../../../api/request';
import { fromJS } from 'immutable';


// 修改歌单数据
const changeCurrentAlbum = (data) => ({
  type: CHANGE_CURRENT_ALBUM,
  data: fromJS(data)
});

// 修改歌单页面进入状态
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});

// 清除当前关于Album在Redux中缓存
export const delectAlbumCacheFromRedux = () => ({
	type: DELETE_CURRENT_ALBUM,
	data: fromJS({})
});

export const getAlbumList = (id) => {
  return dispatch => {
    getAlbumDetailRequest(id).then (res => {
      let data = res.playlist;
      dispatch(changeCurrentAlbum(data));
      dispatch(changeEnterLoading(false));
    }).catch (() => {
      console.log("获取album数据失败！")
    });
  }
};