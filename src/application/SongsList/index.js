import React, { useCallback, useImperativeHandle, memo } from 'react';
import { changePlayList, changeCurrentIndex, changeSequecePlayList } from './../../application/Player/store/actionCreators';
import { connect } from 'react-redux';
import { SongList, SongItem } from "./style";
import { getName } from '../../api/utils';
import PlayAll from '../../baseUI/playall/index.js'


const SongsList = React.forwardRef((props, refs)=> {

  const { collectCount, showCollect, songs } = props;

  // 拿到store当中的dispatch
  const { changePlayListDispatch, changeCurrentIndexDispatch, changeSequecePlayListDispatch } = props;

  const totalCount = songs.length;

  // 接受触发动画的函数
  const { musicAnimation } = props;

  const selectItem = useCallback((e, index) => {
    changePlayListDispatch(songs);
    changeSequecePlayListDispatch(songs);
    changeCurrentIndexDispatch(index);
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  }, [])

  useImperativeHandle(refs, () => ({
    // 向外暴露Singlist的selectItem方法
    playAllButtonClick(e) {
      selectItem(e, 0)
    }
  }));

  let songList = (list) => {
    let res = [];
    for(let i = 0; i < list.length; i++) {
      let item = list[i];
      res.push(
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              { item.ar ? getName(item.ar): getName(item.artists) } - { item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res;
  };

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <PlayAll
        totalCount={totalCount}
        showCollect={showCollect}
        collectCount={collectCount}
        selectItem={selectItem}
      />
      <SongItem>
        { songList(songs) }
      </SongItem>
    </SongList>
  )
});



// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    // 派发修改播放列表的action
    changePlayListDispatch(data){
      dispatch(changePlayList(data));
    },
    // 派发修改当前播放下标的action
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    // 派发修改随机播放列表的action
    changeSequecePlayListDispatch(data) {
      dispatch(changeSequecePlayList(data))
    }
  }
};

export default connect(null, mapDispatchToProps)(memo(SongsList))