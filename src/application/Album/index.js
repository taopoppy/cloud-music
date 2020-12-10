import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import { Container, TopDesc, Menu, SongList, SongItem } from './style.js'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header/index.js'
import Scroll from '../../baseUI/scroll/index.js'
import { getName, getCount, isEmptyObject } from '../../api/utils.js'
import style from "../../assets/global-style";
import { connect } from 'react-redux'
import { changeEnterLoading, getAlbumList, delectAlbumCacheFromRedux} from './store/actionCreators'
import Loading from '../../baseUI/loading/index';

function Album(props) {
	const [showStatus, setShowStatus] = useState(true)
	const [title, setTitle] = useState ("歌单");
	const [isMarquee, setIsMarquee] = useState (false);// 是否跑马灯
	const headerEl = useRef();

	const id = props.match.params.id;

	const { currentAlbum:currentAlbumImmutable, enterLoading } = props;
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

	const renderSongList = () => {
		return (
			<SongList>
				<div className="first_line">
					<div className="play_all">
						<i className="iconfont">&#xe6e3;</i>
						<span > 播放全部 <span className="sum">(共 {currentAlbum.tracks.length} 首)</span></span>
					</div>
					<div className="add_list">
						<i className="iconfont">&#xe62d;</i>
						<span > 收藏 ({getCount(currentAlbum.subscribedCount)})</span>
					</div>
				</div>
				<SongItem>
					{
						currentAlbum.tracks.map((item, index) => {
							return (
								<li key={index}>
									<span className="index">{index + 1}</span>
									<div className="info">
										<span>{item.name}</span>
										<span>
											{ getName(item.ar) } - { item.al.name }
										</span>
									</div>
								</li>
							)
						})
					}
				</SongItem>
			</SongList>
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
			<Container>
				<Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
				{
					!isEmptyObject(currentAlbum) ? (
						<Scroll bounceTop={false} onScroll={handleScroll}>
							<div>
							{ renderTopDesc() }
              { renderMenu() }
              { renderSongList() }
							</div>
						</Scroll>
					) : null
				}
				{ enterLoading ? <Loading></Loading> : null}
			</Container>
		</CSSTransition>
	)
}


const mapStateToProps = (state) => ({
	currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
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