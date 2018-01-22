import { combineReducers } from 'redux'

import surahReducer from './surahReducer'
import surahListReducer from './surahListReducer'
import settingsReducer from './settingsReducer'

const rootReducer = combineReducers({
    surahReducer,
    surahListReducer,
    settingsReducer,
})

export default rootReducer