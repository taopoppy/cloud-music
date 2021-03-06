import React, { memo } from 'react';
import styled from'styled-components';
import style from '../../assets/global-style';


const CircleWrapper = styled.div`
  position: relative;
  circle{
    stroke-width: 8px; // stroke-width属性指定了当前对象的轮廓的宽度
    transform-origin: center; // 变形的中心
    &.progress-background{
      transform: scale(0.9);
      stroke: ${style["theme-color-shadow"]}; // stroke属性定义了给定图形元素的外轮廓的颜色
    }
    &.progress-bar{
      transform: scale(0.9) rotate(-90deg);
      stroke: ${style["theme-color"]};
    }
  }
`

function ProgressCircle(props) {
	const { radius, percent } = props

	// 整个背景的周长(Math.PI俗称3.1415)
	const dashArray = Math.PI * 100

	// 1-percent就是剩下没有播放的比例，dashOffect就是还未播放的进度条长度
	const dashOffset = (1 - percent) * dashArray;

	return (
		<CircleWrapper>
			<svg width={radius} height={radius} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
				<circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent"
								strokeDasharray={dashArray}
								strokeDashoffset={`${dashOffset}`}/>
			</svg>
			{props.children}
		</CircleWrapper>
	)
}

export default memo(ProgressCircle)