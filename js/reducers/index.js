import { combineReducers } from 'redux'

import surahReducer from './surahReducer'
import surahListReducer from './surahListReducer'

const rootReducer = combineReducers({
    surahReducer,
    surahListReducer
})

export default rootReducer