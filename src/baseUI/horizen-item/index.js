import React, { useRef, useEffect, memo } from 'react';
import styled from'styled-components';
import Scroll from '../scroll/index'
import { PropTypes } from 'prop-types';
import style from '../../assets/global-style';

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  >span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style["font-size-m"]};
    vertical-align: middle;
  }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`


function Horizen(props) {
	const { list, oldVal, title } = props
	const { handleClick } = props

	// 加入声明
	const Category = useRef(null)

	// 加入初始化内容宽度的逻辑
	useEffect(()=> {
		let categoryDOM = Category.current;
		let tagElems = categoryDOM.querySelectorAll("span") // 拿到所以span的NodeList
		let totalWidth = 0
		Array.from(tagElems).forEach(ele => {
			totalWidth += ele.offsetWidth
		})
		categoryDOM.style.width = `${totalWidth}px`
	}, [])

	return (
		<Scroll direction={"horizental"}>
			<div ref={Category}>
				<List>
					<span>{title}</span>
					{
						list.map((item) => {
							return (
								<ListItem
									key={item.key}
									className={`${oldVal === item.key ? 'selected': ''}`} 
									onClick={() => handleClick(item.key)}
								>
										{item.name}
								</ListItem>
							)
						})
					}
				</List>
			</div>
		</Scroll>
	)
}



// 接收的参数
Horizen.propTypes = {
	list: PropTypes.array, // 接收的数据列表
  oldVal: PropTypes.string, // 当前的item值
  title: PropTypes.string, // 列表的标题
  handleClick: PropTypes.func // 点击不同的item执行的方法
}

Horizen.defaultProps = {
	list: [],
	oldVal: '',
	title: '',
	handleClick: null
}

export default memo(Horizen)