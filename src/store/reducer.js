import { combineReducers } from 'redux'
import { reducer as recommendReducer } from '../application/Recommend/store/index'
import { reducer as singersReducer } from '../application/Singers/store/index'

export default combineReducers({
	// 这里添加子reducer
	recommend: recommendReducer,
	singers: singersReducer
})
