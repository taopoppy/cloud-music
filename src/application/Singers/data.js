import React, { createContext, useReducer } from 'react'
import { fromJS } from 'immutable'

// context
export const CategoryDataContext = createContext({})

// actionTypes
export const CHANGE_TYPE = 'singers/CHANGE_TYPE';
export const CHANGE_AREA = 'singers/CHANGE_AREA'
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';


// reducer纯函数
const reducer = (state, action) => {
	switch (action.type) {
		case CHANGE_TYPE:
			return state.set('singertype', action.data)
		case CHANGE_AREA:
			return state.set('singerarea', action.data)
		case CHANGE_ALPHA:
			return state.set('singeralpha', action.data)
		default:
			return state
	}
}

// 缓存Provider组件
export const Data = props => {
	const [data, dispatch] = useReducer(reducer, fromJS({
		singertype: '',
		singerarea: '',
		singeralpha: ''
	}))

	return (
		<CategoryDataContext.Provider value={{data, dispatch}}>
			{ props.children}
		</CategoryDataContext.Provider>
	)
}