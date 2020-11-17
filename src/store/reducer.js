import { combineReducers } from 'redux'

// 测试用的子reducer
const moduleReducer = (state={},action) => {
	return state
}

export default combineReducers({
	// 这里添加子reducer
	moduleReducer
})
