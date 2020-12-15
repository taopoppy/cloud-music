import React,{ memo, useCallback, useRef } from "react";
import {  getName } from "../../../api/utils";
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'
import { prefixStyle } from '../../../api/utils'
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  Operators,
  CDWrapper,
} from "./style";

function NormalPlayer(props) {
	const { song, fullScreen } = props;
	const { toggleFullScreen } = props

	const normalPlayerRef = useRef();
	const cdWrapperRef = useRef();

	const transform = prefixStyle("transform");

	// 计算偏移的辅助函数
	const _getPosAndScale = useCallback(() => {
		const targetWidth = 40; // 圆的宽度，或者圆的直径是40
		const paddingLeft = 40; // miniPlay当中的圆心的x坐标是40，因为左边距是20,圆的半径是20
		const paddingBottom = 30; // miniPlay当中的圆心的y坐标是30,因为圆的半径是20，然后整个miniPlay是高60，减去圆的直径40，上下各有10的边距
		const paddingTop = 80; // normal整体上边距是80px
		const width = window.innerWidth * 0.8; // normal当中的大圆直径为视口宽度的80%
		const scale = targetWidth /width; // mini当中的小圆的直径除以normal当中的大圆的直径就是缩放比
		// 两个圆心的横坐标距离和纵坐标距离
		const x = -(window.innerWidth/ 2 - paddingLeft); // normalPlay的圆心就在中央，所以是window.innerWidth/ 2
		const y = window.innerHeight - paddingTop - width / 2 - paddingBottom; // normalPlay的圆心的y坐标用整体视口的高度-标题的高度-圆的半径-标题下面整体的上内边距
		return {
			x,
			y,
			scale
		};
	},[]);

	// 进入动画
	const enter = () => {
		normalPlayerRef.current.style.display = "block"
		const { x, y, scale } = _getPosAndScale()
		let animation = {
			0: {
				transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
			},
			60: {
				transform: `translate3d(0, 0, 0) scale(1.1)`
			},
			100: {
				transform: `translate3d(0, 0, 0) scale(1)`
			}
		}
		// 注册一个动画
		animations.registerAnimation({
			name: "move", // 名称叫move
			animation, // 实际动画的keyframes
			presets: { // 可选项
				duration: 400, // 动画时间400ms
				easing: "linear" // 动画函数linear
			}
		});
		// 将动画附加在某个DOM节点上面（将上面注册的move动画附加在normalPlay中的大圆上，默认只有一次）
		animations.runAnimation(cdWrapperRef.current, "move");
	}

	// 进入动画后
	const afterEnter = () => {
		const cdWrapperDom = cdWrapperRef.current;
		animations.unregisterAnimation("move") // 消除注册的move动画
		cdWrapperDom.style.animation = ""; // normalPlay中的大圆的动画暂时为空
	}

	// 离开动画前
	const leave = () => {
		if (!cdWrapperRef.current) return;
		const cdWrapperDom = cdWrapperRef.current;
		cdWrapperDom.style.transition = "all 0.4s";
		const { x, y, scale } = _getPosAndScale();
		cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
	};

	// 离开动画后
	const afterLeave = () => {
		if (!cdWrapperRef.current) return;
		const cdWrapperDom = cdWrapperRef.current;
		cdWrapperDom.style.transition = "";
		cdWrapperDom.style[transform] = "";
		// 一定要注意现在要把normalPlayer这个DOM给隐藏掉，因为CSSTransition的工作只是把动画执行一遍 
		// 不置为 none 现在全屏播放器页面还是存在
		normalPlayerRef.current.style.display = "none";
	};


  return (
		<CSSTransition
			classNames="normal"
			in={fullScreen} // 动画的状态
			timeout={400}
			mountOnEnter
			onEnter={enter}
			onEntered={afterEnter}
			onExit={leave}
			onExited={afterLeave}
		>
			<NormalPlayerContainer ref={normalPlayerRef}>
				<div className="background">
					<img
						src={song.al.picUrl + "?param=300x300"}
						width="100%"
						height="100%"
						alt="歌曲图片"
					/>
				</div>
				<div className="background layer"></div>
				<Top className="top">
					<div className="back" onClick={()=> {toggleFullScreen(false)}}>
						<i className="iconfont icon-back">&#xe662;</i>
					</div>
					<h1 className="title">{song.name}</h1>
					<h1 className="subtitle">{getName(song.ar)}</h1>
				</Top>
				<Middle ref={cdWrapperRef}>
					<CDWrapper>
						<div className="cd">
							<img
								className="image play"
								src={song.al.picUrl + "?param=400x400"}
								alt=""
							/>
						</div>
					</CDWrapper>
				</Middle>
				<Bottom className="bottom">
					<Operators>
						<div className="icon i-left" >
							<i className="iconfont">&#xe625;</i>
						</div>
						<div className="icon i-left">
							<i className="iconfont">&#xe6e1;</i>
						</div>
						<div className="icon i-center">
							<i className="iconfont">&#xe723;</i>
						</div>
						<div className="icon i-right">
							<i className="iconfont">&#xe718;</i>
						</div>
						<div className="icon i-right">
							<i className="iconfont">&#xe640;</i>
						</div>
					</Operators>
				</Bottom>
			</NormalPlayerContainer>
		</CSSTransition>
  );
}

export default memo(NormalPlayer);