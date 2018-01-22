import {TOGGLE_ARABE,
    TOGGLE_FRANCAIS,
    TOGGLE_PHONETIQUE} from '../constants'


const initialState = {
    arabe: true,
    francais: true,
    phonetique: false,
}

export default settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_ARABE:
            return {
                ...state,
                arabe: action.checked,
            }
        case TOGGLE_FRANCAIS:
            return {
                ...state,
                francais: action.checked,
            }
        case TOGGLE_PHONETIQUE:
            return {
                ...state,
                phonetique: action.checked,
            }
        default:
            return state;
    }
}
