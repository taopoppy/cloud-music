import React, { memo } from 'react'
import PropTypes from "prop-types"
import styled from 'styled-components';
import style from '../../assets/global-style';

const PlayAllWrapper = styled.div`
	box-sizing: border-box;
	padding: 10px 0;
	margin-left: 10px;
	position: relative;
	justify-content: space-between;
	border-bottom: 1px solid ${style["border-color"]};
	.play_all{
		display: inline-block;
		line-height: 24px;
		color: ${style["font-color-desc"]};
		.iconfont {
			font-size: 24px;
			margin-right: 10px;
			vertical-align: top;
		}
		.sum{
			font-size: ${style["font-size-s"]};
			color: ${style["font-color-desc-v2"]};
		}
		>span{
			vertical-align: top;
		}
	}
	.add_list,.isCollected {
		display: flex;
		align-items: center;
		position: absolute;
		right: 0; top :0; bottom: 0;
		width: 130px;
		line-height: 34px;
		background: ${style["theme-color"]};
		color: ${style["font-color-light"]};
		font-size: 0;
		border-radius: 3px;
		vertical-align: top;
		.iconfont {
			vertical-align: top;
			font-size: 10px;
			margin: 0 5px 0 10px;
		}
		span{
			font-size: 14px;
			line-height: 34px;
		}
	}
	.isCollected{
		display: flex;
		background: ${style["background-color"]};
		color: ${style["font-color-desc"]};
	}
`

function PlayAll(props) {
	const { totalCount, showCollect, collectCount } = props
	const { selectItem } = props

	const collect = (count) => {
    return  (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count/1000)/10}万)</span>
      </div>
    )
  };

	return (
		<PlayAllWrapper>
			<div className="play_all" onClick={(e) => selectItem(e, 0)}>
				<i className="iconfont">&#xe6e3;</i>
				<span>播放全部 <span className="sum">(共{totalCount}首)</span></span>
			</div>
			{ showCollect ? collect(collectCount) : null}
		</PlayAllWrapper>
	)
}

PlayAll.propTypes = {
	selectItem: PropTypes.func,
	totalCount: PropTypes.number,
	showCollect: PropTypes.bool,
	collectCount: PropTypes.number
}

PlayAll.defaultProps = {
	selectItem: null,
	totalCount: 0,
	showCollect: false,
	collectCount: 0
}

export default memo(PlayAll)