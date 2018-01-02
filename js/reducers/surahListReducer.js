import { FETCH_SURAH_LISTE, FETCH_SURAH_LISTE_SUCCESS, FETCH_SURAH_LISTE_FAILURE } from '../constants'

const initialState = {
    surahList: [],
    langue: "ar",
    isLoading: false,
    error: false,
}

// Redux Lecture
export default surahListReducer = (state = initialState, action) => {
    switch (action.type) {
        // Demande : Récupération de la liste des sourates
        case FETCH_SURAH_LISTE:
            return {
                ...state,
                isLoading: true,
                surahList: []
            }
        // Success : Récupération de la liste des sourates
        case FETCH_SURAH_LISTE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                surahList: action.data,
            }

        // Erreur : Retour de l'état error true
        case FETCH_SURAH_LISTE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true,
            }

        default:
            return state;
    }
};