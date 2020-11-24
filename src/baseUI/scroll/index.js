import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-components'

const ScrollContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
`


const Scroll = forwardRef((props, ref)=>{
	// better-scroll类实例的存储对象
	const [bScroll, setBScroll] = useState();

	const scrollContaninerRef = useRef()

	// eslint-disable-next-line
	const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props; 
	const { pullUp, pullDown, onScroll } = props;

	// 创建better-scroll类实例对象
	useEffect(() => {
		const scroll = new BScroll(scrollContaninerRef.current, {
			scrollX: direction === "horizental",
			scrollY: direction === "vertical",
			probeType: 3, // 滑动过程和滚动动画中实时派发scroll事件
			click: click,
			bounce:{
				top: bounceTop,
				bottom: bounceBottom
			}
		})
		setBScroll(scroll)
		return ()=> {
			setBScroll(null)
		}
		// eslint-disable-next-line
	},[])

	// 每次重新渲染都要刷新实例，防止无法滑动
	useEffect(()=> {
		if(refresh && bScroll) {
			bScroll.refresh()
		}
	})


	// 给实例绑定scroll事件，当滑动的时候可以执行外部传入的回调函数
	useEffect(()=> {
		if(!bScroll || !onScroll) return
		bScroll.on("scroll", (scroll)=> {
			// 调用外部传入的滑动回调函数
			onScroll(scroll)
		})
		return ()=> {
			bScroll.off("scroll")
		}
	},[onScroll, bScroll])


	// 上拉到底的判断，调用上拉刷新的函数
	useEffect (() => {
		if (!bScroll || !pullUp) return;
		bScroll.on ('scrollEnd', () => {
			// 判断是否滑动到了底部
			if (bScroll.y <= bScroll.maxScrollY + 100){
				console.log("scrollEnd判断滑动到了底部")
				pullUp();
			}
		});
		return () => {
			bScroll.off ('scrollEnd');
		}
	}, [pullUp, bScroll]);

	// 进行下拉的判断，调用下拉刷新的函数
	useEffect (() => {
		if (!bScroll || !pullDown) return;
		bScroll.on ('touchEnd', (pos) => {
			// 判断用户的下拉动作
			if (pos.y > 50) {
				console.log("touchEnd判断滑动到了顶部")
				pullDown();
			}
		});
		return () => {
			bScroll.off ('touchEnd');
		}
	}, [pullDown, bScroll]);

	// 给外界暴露refresh方法
	useImperativeHandle(ref, ()=> ({
		refresh() {
			if(bScroll) {
				bScroll.refresh()
				bScroll.scrollTo(0, 0)
			}
		},
		getBScroll() {
			if(bScroll) {
				return bScroll
			}
		}
	}))

	return (
		<ScrollContainer ref={scrollContaninerRef}>
			{props.children}
		</ScrollContainer>
	)

})

Scroll.propTypes = {
	direction: PropTypes.oneOf (['vertical', 'horizental']),// 滚动的方向
  click: PropTypes.bool,// 是否支持点击
  refresh: PropTypes.bool,// 是否刷新
  onScroll: PropTypes.func,// 滑动触发的回调函数
  pullUp: PropTypes.func,// 上拉加载逻辑
  pullDown: PropTypes.func,// 下拉加载逻辑
  pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool,// 是否支持向上吸顶
  bounceBottom: PropTypes.bool// 是否支持向下吸底
}

Scroll.defaultProps = {
	direction: "vertical", // 垂直
  click: true, // 支持点击
  refresh: true, // 支持刷新
  onScroll:null, // 暂无滑动触发的回调函数
	pullUpLoading: false, // 不显示上拉loading动画
  pullDownLoading: false, // 不显示下拉loading动画
  pullUp: null, // 暂无上拉加载逻辑
  pullDown: null, // 暂无下拉加载逻辑
  bounceTop: true, // 支持向上吸顶
  bounceBottom: true // 支持向下吸底
}

export default Scroll