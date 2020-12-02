import React, { memo, useState, useCallback } from 'react'
import { Container } from './style.js'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header/index.js'

function Album(props) {
	const [showStatus, setShowStatus] = useState(true)

	const handleBack = useCallback(() => {
		setShowStatus(false);
	}, [setShowStatus]);

	return(
		<CSSTransition
			in={showStatus}  // 动画的状态
			timeout={500}    // 动画的时间
      classNames="fly" // 动画css的前缀，默认是fade
      appear={true}    // 页面第一次也会出现动画
      unmountOnExit    // 隐藏的时候消除DOM
      onExited={props.history.goBack} // 退出的时候执行返回前一个页面
		>
			<Container>
				<Header title={"返回"} handleClick={handleBack}></Header>
			</Container>
		</CSSTransition>
	)
}


export default memo(Album)