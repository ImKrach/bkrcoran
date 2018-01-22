import {
	FETCH_SURAH,
	FETCH_SURAH_SUCCESS,
	FETCH_SURAH_FAILURE,
	FETCH_EDITION,
	FETCH_EDITION_SUCCESS,
	FETCH_EDITION_FAILURE,
	CHANGE_SURAH,
	CHANGE_EDITION,
	PLAY_SURAH,
	PAUSE_SURAH,
} from '../constants';

const initialState = {
	surahIndex: 0,
	ayahList: [],
	name: '',
	nameTranslated: '',
	loading: true,
	playing: false,
	error: false,
};

// Redux Lecture
export default (surahReducer = (state = initialState, action) => {
	switch (action.type) {
		// Demande : Récupération de sourate
		case FETCH_SURAH:
			return {
				...state,
				loading: true,
				name: '',
				nameTranslated: '',
				ayahList: [],
			};
		// Success : Récupération de sourate
		case FETCH_SURAH_SUCCESS:
			// Removing "Bismillah Ar-Rahman Ar-Rahim" for the first verse (only if not Al-Fatiha)
			if (action.data[0].number !== 1) {
				action.data[0].text = action.data[0].text.slice(39);
			}

			// Adding playing = false for each ayah of the surah
			for (let i = 0; i < action.data.length; i++) {
				action.data[i].playing = false;
				action.data[i].ayahIndex = i;
				action.data[i].ayahNumber = action.data[i].numberInSurah;
			}

			return {
				...state,
				loading: false,
				ayahList: action.data,
				surahIndex: action.data[0].number - 1,
				surahNumber: action.data[0].number,
				name: action.meta.name,
				nameTranslated: action.meta.nameTranslated,
			};

		// Erreur : Récupération de sourate
		case FETCH_SURAH_FAILURE:
			return {
				...state,
				loading: true,
				error: true,
				name: '',
				nameTranslated: '',
			};

		case PLAY_SURAH:
			if (state.loading === false && state.error === false) {
				state.ayahList[action.ayahIndex].playing = true;
				return {
					...state,
					playing: true,
				};
			} else {
				return { ...state };
			}

		case PAUSE_SURAH:
			if (
				state.loading === false &&
				state.error === false &&
				state.playing === true
			) {
				state.ayahList[action.ayahIndex].playing = false;
				return {
					...state,
					playing: false,
				};
			} else {
				return { ...state };
			}

		default:
			return state;
	}
});
