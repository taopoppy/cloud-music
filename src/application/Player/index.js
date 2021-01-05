import React, { memo, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen
} from "./store/actionCreators";
import MiniPlayer from './miniPlayer/index.js'
import NormalPlayer from './normalPlayer/index.js'
import { isEmptyObject, getSongUrl, shuffle, findIndex } from "../../api/utils";
import Toast from '../../baseUI/Toast/index.js'
import { playMode } from '../../api/config'

function Player(props) {
  const audioRef = useRef()
  const toastRef = useRef()
  const songReady = useRef(true) // 解决歌曲是否能开始播放

  const {
    fullScreen, // 歌曲播放是否是全屏状态
    playing, // 当前歌曲的播放状态（正在播放还是暂停）
    currentIndex,// currentIndex表示挡墙播放歌曲在播放列表中的数组下标
    currentSong: immutableCurrentSong, // 当前播放信息
    playList: immutablePlayList, // 播放列表
    mode, // 播放模式
    sequencePlayList:immutableSequencePlayList,// 顺序列表
  } = props
  const {
    toggleFullScreenDispatch, // 改变fullScreen
    togglePlayingDispatch, // 改变playing
    changeCurrentIndexDispatch, // 改变currentindex
    changeCurrentDispatch, // 改变当前播放歌曲
    changePlayListDispatch,// 改变playList
    changeModeDispatch,// 改变mode
  } = props


  // 播放器当中播放和暂停按钮点击事件
  const clickPlaying = (e, state) => {
    e.stopPropagation() // 阻止捕获和冒泡阶段中当前事件的进一步传播。因为整个mini播放器也有点击事件
    togglePlayingDispatch(state) // 提交修改歌曲播放状态的action
  }


  // 相关播放属性
  const [ currentTime, setCurrentTime ] = useState(0) // 目前播放时间
  const [ duration, setDuration ] = useState(0) // 歌曲总时长
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration // 播放进度
  const [modeText, setModeText] = useState(""); // 播放模式显示的文字

  // immutable数据转向js格式
  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  // 记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});

  useEffect(()=> {
    if (!playList.length || currentIndex === -1 || !playList[currentIndex] || playList[currentIndex].id === preSong.id || !songReady.current) return;
    let current = playList[currentIndex];
    setPreSong(current);
    songReady.current = false; // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    changeCurrentDispatch(current);// 赋值currentSong
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      // 注意，play方法返回的是一个promise 对象
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    togglePlayingDispatch(true); // 播放状态
    setCurrentTime(0); // 从头开始播放
    setDuration((current.dt / 1000) | 0); // 时长
  },[playList, currentIndex])


  // 播放和暂停
  useEffect(() => {
    playing ? audioRef.current.play(): audioRef.current.pause()
  },[playing])

  // 音乐播放会不停的更新当前播放时间
  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime)
  }

  // normalPlayer拖动进度条后调用的函数
  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    // 如果在暂停状态下，拖动进度条或者点击进度条进入一个新的进度就从那个进度开始播放
    if (!playing) {
      togglePlayingDispatch(true)
    }
  }

  // 一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    // changePlayingState(true)
    togglePlayingDispatch(true)
    audioRef.current.play()
  }

  // 播放前一首
  const handlePrev = () => {
    // 播放列表当中只有一首歌
    if(playList.length === 1) {
      handleLoop()
      return
    }
    // 播放列表当中前一首
    let index = currentIndex - 1
    if(index < 0) {
      // 当前播放歌曲如果是第一首，上一首应该是播放列表的最后一首
      index = playList.length - 1
    }
    if(!playing) {
      togglePlayingDispatch(true)
    }
    changeCurrentIndexDispatch(index)
  }

  // 播放下一首
  const handleNext = () => {
    // 播放列表中只有一首歌
    if(playList.length === 1) {
      handleLoop()
      return
    }
    // 播放列表当中的下一首
    let index = currentIndex + 1
    if(index === playList.length) {
      // 当前播放歌曲如果是最后一首，下一首就应该是播放列表的第一首
      index = 0
    }
    if(!playing) {
      togglePlayingDispatch()
    }
    changeCurrentIndexDispatch(index)
  }

  // 改变播放模式
  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  }


  // 播放器播放完毕一首歌后
  const handleEnd = () => {
    if(mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }

  // 播放器出错的处理函数
  const handleError = () => {
    songReady.current = true;
    alert ("播放出错");
  };

	return(
		<div>
      {
        isEmptyObject(currentSong)? null :
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          percent={percent}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
        />
      }
      {
        isEmptyObject(currentSong)? null :
        <NormalPlayer
          song={currentSong} // 当前歌曲信息
          fullScreen={fullScreen} // 是否是全屏显示
          playing={playing} // 歌曲处于播放还是暂停状态
          duration={duration} // 歌曲的时长
          currentTime={currentTime} // 歌曲当前的播放时间
          onProgressChange={onProgressChange} // 拖动进度条和点击进度条的回调函数
          percent={percent} // 播放进度百分比
          toggleFullScreen={toggleFullScreenDispatch} // 修改全屏状态
          clickPlaying={clickPlaying} // 点击播放和暂停的点击事件
          handlePrev={handlePrev} // 播放上一首的逻辑
          handleNext={handleNext} // 播放下一首的逻辑
          mode={mode} // 播放模式
          changeMode={changeMode} // 改变播放模式
        />
      }
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime} // 播放器一直播放就会更新时间
        onEnded={handleEnd} // 播放器播放完毕一首歌的处理函数
        onError={handleError} // 播放出错的处理函数
      />
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
	)
}

const mapStateToProps = state => ({
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", "currentSong"]),
  showPlayList: state.getIn(["player", "showPlayList"]),
  mode: state.getIn(["player", "mode"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  playList: state.getIn(["player", "playList"]),
  sequencePlayList: state.getIn(["player", "sequencePlayList"])
});

const mapDispatchToProps = dispatch => {
  return {
    // 修改当前播放状态
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    // 派发是否全屏播放的action
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    // 修改是否展示播放列表
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    // 修改当前播放歌曲的下标
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    // 修改当前播放歌曲
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    // 修改播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    // 修改播放列表数组
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(memo(Player))