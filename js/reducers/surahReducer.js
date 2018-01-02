import { FETCH_SURAH, FETCH_SURAH_SUCCESS, FETCH_SURAH_FAILURE, FETCH_EDITION, FETCH_EDITION_SUCCESS, FETCH_EDITION_FAILURE, CHANGE_SURAH, CHANGE_EDITION } from '../constants'

const initialState = {
    surah: 0,
    ayahList: [],
    name:"",
    nameTranslated:"",
    isLoading: false,
    error: false,
}

// Redux Lecture
export default surahReducer = (state = initialState, action) => {
    switch (action.type) {
        // Demande : Récupération de sourate
        case FETCH_SURAH:
            return {
                ...state,
                isLoading: true,
                name:"",
                nameTranslated: "",
                ayahList: []
            }
        // Success : Récupération de sourate 
        case FETCH_SURAH_SUCCESS:
            // Removing "Bismillah Ar-Rahman Ar-Rahim" for the first verse (only if not Al-Fatiha)
            if (action.data[0].number !== 1) {
                action.data[0].text = action.data[0].text.slice(39)
            }
            
            return {
                ...state,
                isLoading: false,
                ayahList: action.data,
                surah: action.data[0].number,
                name: action.meta.name,
                nameTranslated:action.meta.nameTranslated,
            }
            
        // Erreur : Récupération de sourate 
        case FETCH_SURAH_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true,
                name: "",
                nameTranslated: "",
            }

        default:
            return state;
    }
};