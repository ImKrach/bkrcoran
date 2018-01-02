import { FETCH_SURAH, FETCH_SURAH_SUCCESS, FETCH_SURAH_FAILURE, FETCH_EDITION, FETCH_EDITION_SUCCESS, FETCH_EDITION_FAILURE, CHANGE_SURAH, CHANGE_EDITION, FETCH_SURAH_LISTE, FETCH_SURAH_LISTE_SUCCESS, FETCH_SURAH_LISTE_FAILURE } from './constants'
import axios from 'axios'

export function fetchSurah(surahNumber, quranEdition = 'quran-complete', where = 'data') {
    return (dispatch) => {
        dispatch(getSurah())

        switch (where) {
            case 'data':
                let quran, surah
                switch (quranEdition) {
                    case 'quran-simple':
                        quran = require('../data/quran-simple.json')
                        break;
                    case 'quran-complete':
                        quran = require('../data/quran-complete.json')
                        break;
                    case 'quran-uthmani':
                        quran = require('../data/quran-uthmani.json')
                        break;
                    case 'quran-tafsir.ar.muyassar':
                        quran = require('../data/quran-tafsir.ar.muyassar.json')
                        break;
                    case 'quran-tafsir.ar.jalalayn':
                        quran = require('../data/quran-tafsir.ar.jalalayn.json')
                        break;
                    default:
                        quran = require('../data/quran-simple.json')
                        break;
                }


                surah = quran[surahNumber - 1]
                dispatch(getSurahSuccess(surah.ayahs, { name: surah.name, nameTranslated: surah.englishName, playing: false }))
                break;

            case 'api':
                quranEdition = (quranEdition === 'quran-tafsir.ar.muyassar') ? 'ar.muyassar' : quranEdition;
                quranEdition = (quranEdition === 'quran-tafsir.ar.jalalayn') ? 'ar.jalalayn' : quranEdition;
                axios.get('http://api.alquran.cloud/surah/' + surahNumber + '/' + quranEdition)
                .then((response) => {
                    // Réponse reçue
                    dispatch(getSurahSuccess(response.data.data.ayahs, {name:response.data.data.name, nameTranslated:response.data.data.englishName}))
                })
                .catch((err) => {
                    // Erreur
                    dispatch(getSurahFailure(err))
                });
            default:
                // Erreur
                dispatch(getSurahFailure(err))
                break;
        }
    }
}

export function fetchSurahList(quranEdition = 'quran-complete', where = 'data') {

    return (dispatch) => {
        dispatch(getSurahList());

        switch (where) {
            case 'data':
                let quran, surahList = [];
                switch (quranEdition) {
                    case 'quran-simple':
                        quran = require('../data/quran-simple.json');
                        break;
                    case 'quran-complete':
                        quran = require('../data/quran-complete.json');
                        break;
                    case 'quran-uthmani':
                        quran = require('../data/quran-uthmani.json');
                        break;
                    default:
                        quran = require('../data/quran-simple.json');
                        break;
                }

                // On ne veut que les titres et numéros de sourate dans cette liste
                for (i = 0; i < quran.length; i++) {
                    surahList.push({
                        "surahNumber" : quran[i].number,
                        "name" : quran[i].name,
                        "nameTranslated" : quran[i].englishName,
                        "revelationPlace" : quran[i].revelationType,
                        "playing": false,
                        "size": quran[i].ayahs.length,
                    })
                }

                dispatch(getSurahListSuccess(surahList));
                break;
            case 'api':
                axios.get('http://api.alquran.cloud/quran/' + quranEdition)
                    .then((response) => {
                        // Réponse reçue
                        dispatch(getSurahListSuccess(response.data.data.surahs))
                    })
                    .catch((err) => {
                        // Erreur
                        dispatch(getSurahListFailure(err))
                    });

                break;
            default:
                // Erreur
                dispatch(getSurahListFailure(err))
                break;
        }
    }
}

function getSurah() {
    return {
        type: FETCH_SURAH
    }
}

function getSurahSuccess(data, meta) {
    return {
        type: FETCH_SURAH_SUCCESS,
        data,
        meta
    }
}

function getSurahFailure() {
    return {
        type: FETCH_SURAH_FAILURE
    }
}

function getSurahList() {
    return {
        type: FETCH_SURAH_LISTE
    }
}

function getSurahListSuccess(data) {
    return {
        type: FETCH_SURAH_LISTE_SUCCESS,
        data,
    }
}

function getSurahListFailure() {
    return {
        type: FETCH_SURAH_LISTE_FAILURE
    }
}

function getEdition() {
    return {
        type: FETCH_EDITION
    }
}


function getEditionSuccess() {
    return {
        type: FETCH_EDITION_SUCCESS
    }
}

function getEditionFailure() {
    return {
        type: FETCH_EDITION_FAILURE
    }
}
