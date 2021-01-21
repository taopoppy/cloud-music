import React, { memo, useRef } from 'react';
import { getName } from '../../../api/utils';
import { MiniPlayerContainer } from './style';
import { CSSTransition } from 'react-transition-group'
import ProgressCircle from '../../../baseUI/progress-circle/index.js'

function MiniPlayer (props) {
  // song是当前播放歌曲信息， fullScreen是当前是否为全屏模式，playing是当前播放状态，percent是播放进度数据
  const { song, fullScreen, playing, percent  } = props; 
  // 切换mini屏和全屏的函数，切换是否显示播放列表的函数
  const { toggleFullScreen, togglePlayList } = props
  // clickPlaying是mini播放器当中的播放和暂停的按钮点击函数
  const { clickPlaying, setFullScreen } = props;
	const miniPlayerRef = useRef();

  // 点击显示播放列表
  const handleTogglePlayList = (e) => {
    togglePlayList(true);
    e.stopPropagation(); // 因为mini本身也是可以点击的，所以禁止点击冒泡
  };


  return (
		<CSSTransition
			in={!fullScreen}
			timeout={400}
			classNames="mini"
			onEnter={()=> {
				miniPlayerRef.current.style.display = "flex"
			}}
			onExited={()=> {
				miniPlayerRef.current.style.display = "none"
			}}
		>
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => toggleFullScreen(true)}>
        <div className="icon">
          <div className="imgWrapper">
            <img className={`play ${playing? "": "pause"}`} src={song.al.picUrl} width="40" height="40" alt="img"/>
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
          { playing ?
            <i className="icon-mini iconfont icon-pause" onClick={e => clickPlaying(e, false)}>&#xe650;</i>
            :
            <i className="icon-mini iconfont icon-play" onClick={e => clickPlaying(e, true)}>&#xe61e;</i>
          }
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
		</CSSTransition>
  )
}

export default memo(MiniPlayer);