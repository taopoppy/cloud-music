import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import { Container, TopDesc, Menu } from './style.js'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header/index.js'
import Scroll from '../../baseUI/scroll/index.js'
import { isEmptyObject } from '../../api/utils.js'
import style from "../../assets/global-style";
import { connect } from 'react-redux'
import { changeEnterLoading, getAlbumList, delectAlbumCacheFromRedux} from './store/actionCreators'
import Loading from '../../baseUI/loading/index';
import SongsList from '../SongsList';
import MusicNote from "../../baseUI/music-note/index";

function Album(props) {
	const [showStatus, setShowStatus] = useState(true)
	const [title, setTitle] = useState ("歌单");
	const [isMarquee, setIsMarquee] = useState (false);// 是否跑马灯
	const headerEl = useRef();

	// 音符
	const musicNoteRef = useRef();
	// 音符动画
	const musicAnimation = (x, y) => {
		musicNoteRef.current.startAnimation ({ x, y });
	};

	const id = props.match.params.id;

	const { currentAlbum:currentAlbumImmutable, enterLoading, songsCount } = props;
	const { getAlbumDataDispatch,deleteAblumCacheFromRedux } = props;

	useEffect(() => {
		getAlbumDataDispatch(id);
		return () => {
			deleteAblumCacheFromRedux()
		}
		// eslint-disable-next-line
	}, []);

	let currentAlbum = currentAlbumImmutable.toJS();

	const handleBack = useCallback(() => {
		setShowStatus(false);
	}, [setShowStatus]);

	const HEADER_HEIGHT = 45;

	const handleScroll = useCallback((pos) => {
		let minScrollY = -HEADER_HEIGHT;
		let percent = Math.abs(pos.y/minScrollY);
		let headerDom = headerEl.current;
		// 滑过顶部的高度开始变化
		if (pos.y < minScrollY) {
			headerDom.style.backgroundColor = style["theme-color"];
			headerDom.style.opacity = Math.min(1, (percent-1)/2);
			setTitle(currentAlbum.name);
			setIsMarquee(true);
		} else {
			headerDom.style.backgroundColor = "";
			headerDom.style.opacity = 1;
			setTitle("歌单");
			setIsMarquee(false);
		}
	},[currentAlbum]);


	const renderTopDesc = () => {
		return (
			<TopDesc background={currentAlbum.coverImgUrl}>
				<div className="background">
				<div className="filter"></div>
				</div>
				<div className="img_wrapper">
					<div className="decorate"></div>
					<img src={currentAlbum.coverImgUrl} alt=""/>
					<div className="play_count">
						<i className="iconfont play">&#xe885;</i>
						<span className="count">{Math.floor(currentAlbum.subscribedCount/1000)/10} 万 </span>
					</div>
				</div>
				<div className="desc_wrapper">
					<div className="title">{currentAlbum.name}</div>
					<div className="person">
						<div className="avatar">
							<img src={currentAlbum.creator.avatarUrl} alt=""/>
						</div>
						<div className="name">{currentAlbum.creator.nickname}</div>
					</div>
				</div>
			</TopDesc>
		)
	}

	const renderMenu = () => {
		return (
			<Menu>
				<div>
					<i className="iconfont">&#xe6ad;</i>
					评论
				</div>
				<div>
					<i className="iconfont">&#xe86f;</i>
					点赞
				</div>
				<div>
					<i className="iconfont">&#xe62d;</i>
					收藏
				</div>
				<div>
					<i className="iconfont">&#xe606;</i>
					更多
				</div>
			</Menu>
		)
	}

	return(
		<CSSTransition
			in={showStatus}  // 动画的状态
			timeout={300}    // 动画的时间
      classNames="fly" // 动画css的前缀，默认是fade
      appear={true}    // 页面第一次也会出现动画
      unmountOnExit    // 隐藏的时候消除DOM
      onExited={props.history.goBack} // 退出的时候执行返回前一个页面
		>
			<Container play={songsCount}>
				<Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
				{
					!isEmptyObject(currentAlbum) ? (
						<Scroll bounceTop={false} onScroll={handleScroll}>
							<div>
							{ renderTopDesc() }
              { renderMenu() }
							<SongsList
								songs={currentAlbum.tracks}
								collectCount={currentAlbum.subscribedCount}
								showCollect={true}
								showBackground={true}
								musicAnimation={musicAnimation}
							></SongsList>
							</div>
						</Scroll>
					) : null
				}
				{ enterLoading ? <Loading></Loading> : null}
				<MusicNote ref={musicNoteRef}></MusicNote>
			</Container>
		</CSSTransition>
	)
}


const mapStateToProps = (state) => ({
	currentAlbum: state.getIn(['album', 'currentAlbum']),
	enterLoading: state.getIn(['album', 'enterLoading']),
	// 根据当前playList的长度来判断底部bottom是否要给mini播放器腾出位置
	songsCount: state.getIn(['player','playList']).size
})

const mapDispatchToProps = (dispatch) => {
	return {
		getAlbumDataDispatch(id) {
			dispatch(changeEnterLoading(true))
			dispatch(getAlbumList(id))
		},
		deleteAblumCacheFromRedux() {
			dispatch(delectAlbumCacheFromRedux())
		}
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(memo(Album))