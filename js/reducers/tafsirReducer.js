import { FETCH_TAFSIR, FETCH_TAFSIR_SUCCESS, FETCH_TAFSIR_FAILURE} from '../constants'

const initialState = {
    surah: 0,
    ayahList: [],
    langue: "ar",
    isLoading: false,
    error: false,
}

export default tafsirReducer = (state = initialState, action) => {
    switch (action.type) {
        // Demande : Récupération du tafsir d'une sourate
        case FETCH_TAFSIR:
            return {
                ...state,
                isLoading: true,
                ayahList: []
            }
        // Success : Récupération du tafsir de la sourate
        case FETCH_TAFSIR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ayahList: action.data,
                surah: action.data[0].number,
            }

        // Erreur : Retour de l'état error true
        case FETCH_TAFSIR_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true,
            }
    
        default:
            return state;
    }
}