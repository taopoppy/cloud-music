import {
  CHANGE_SONGS_OF_ARTIST,
  CHANGE_ARTIST,
  CHANGE_ENTER_LOADING,
  DELETE_ARTIST,
  DELETE_SONGS_OF_ARTIST
} from './constants';
import { fromJS } from 'immutable';
import { getSingerInfoRequest } from './../../../api/request';


// 修改歌手信息的action
const changeArtist = (data) => ({
  type: CHANGE_ARTIST,
  data: fromJS(data)
});

// 修改歌曲列表的action
const changeSongs = (data) => ({
  type: CHANGE_SONGS_OF_ARTIST,
  data: fromJS(data)
})

// 修改进场动画状态的action
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
})

// 清除redux当中关于Singer页面的歌手信息
export const deleteArtist = () => ({
  type: DELETE_ARTIST,
  data: fromJS({})
})

// 清除redux当中关于Singer页面的歌手歌曲信息
export const deleteSongs = () => ({
  type: DELETE_SONGS_OF_ARTIST,
  data: fromJS([])
})

// 异步获取歌手信息的action
export const getSingerInfo = (id) => {
  return dispatch => {
    getSingerInfoRequest(id).then(data => {
      dispatch(changeArtist(data.artist));
      dispatch(changeSongs(data.hotSongs));
      dispatch(changeEnterLoading(false));
    })
  }
}