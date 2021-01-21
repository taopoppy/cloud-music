import React,{ memo } from 'react';
import {connect} from "react-redux";
import { PlayListWrapper, ScrollWrapper } from './style';
import { changeShowPlayList } from '../store/actionCreators'


function PlayList(props) {
  return (
    <PlayListWrapper>
      <div className="list_wrapper">
        <ScrollWrapper></ScrollWrapper>
      </div>
    </PlayListWrapper>
  )
}

const mapStateToProps = (state) => ({
  showPlayList: state.getIn(['player', 'showPlayList']),
});

const mapDispatchToProps = (dispatch) => {
  return {
		// 切换播放列表显示
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    }
  }
};

// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(memo(PlayList));