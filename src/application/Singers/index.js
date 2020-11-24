import React, { useCallback, useState } from 'react'
import Horizen from '../../baseUI/horizen-item/index.js'
import {categoryTypes,alphaTypes } from '../../api/config'
import { NavContainer } from './style.js'

function Singers(props) {
	let [category, setCategory] = useState('') // 存储热门分类选中项
	let [alpha, setAlpha] = useState(''); // 存储首字目选中项

	let handleUpdateCatetory = useCallback((val) => {
    setCategory(val);
  },[])

	let handleUpdateAlpha = useCallback((val) => {
    setAlpha(val);
  },[])

	return(
		<NavContainer>
			<Horizen
				list={categoryTypes}
				title={"分类(默认热门):"}
				handleClick={handleUpdateCatetory}
				oldVal={category}
			></Horizen>
			<Horizen
				list={alphaTypes}
				title={"首字母:"}
				handleClick={handleUpdateAlpha}
				oldVal={alpha}
			></Horizen>
		</NavContainer>
	)
}

export default React.memo(Singers)