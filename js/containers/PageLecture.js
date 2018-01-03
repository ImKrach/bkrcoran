import React from 'react'
import { StyleSheet,
    View,
    FlatList,
    Image,
    Platform,
    ImageBackground,
    ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { fetchSurah, fetchSurahList } from '../actions'
import generalStyles from '../style'
import Ayah from '../components/Ayah'
import LectureHeader from '../components/LectureHeader'

import Sound from "react-native-sound";

const mapStateToProps = (state) => {
    return {
        surah: state.surahReducer,
        surahList: state.surahListReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getSurah: (surahNumber) => dispatch(fetchSurah(surahNumber)),
        getSurahList: () => dispatch(fetchSurahList()),
    };
};

class PageLecture extends React.PureComponent {

    static navigationOptions = {
        tabBarLabel: 'Lecture',
        tabBarIcon: ({ tintColor }) => (
            <Image style={generalStyles.menuImage} source={require('../../assets/icons/reading-quran-white.png')} />
        ),
    };


    constructor(props) {
        super(props);

        // Enable playback in silence mode
        Sound.setCategory('Playback');

        this.state = {
            selected: new Map(),
        };
    }

    componentWillMount() {
        // Récupération de L'Ouverture
        this.props.getSurah(1);

        // Récupération de la liste des sourates du Coran
        this.props.getSurahList();
    }

    // Si de nouvelles propriétés sont reçues
    componentWillReceiveProps(nextProps) {
       
    }

    // Demande de la sourate #surahNumber
    _onPressSurah = (surahNumber) => {
        // Récupération de la sourate demandée
        this.props.getSurah(surahNumber);
    };

    // Clique sur le bouton de la sourate (celui du header)
    _onPlaySurah = (surahNumber) => {
        // Routine de lecture
        this._onPlayAyah(0);
    };

    _onPauseSurah = (surahNumber) => {
        if (this.player instanceof Sound) {
            if (this.props.surah.playing) {
                console.log("Pausing");
                this.player.pause();
            } else {
                console.log("Playing");
                this.player.play();
            }

            // Mise à jour de l'état playing
            this.props.surah.playing = !this.props.surah.playing;
            
        } else {
            console.log('Le player nexistait pas encore, on lance la ayah 0')
            this._onPlayAyah(0);
        }
    };

    _onPlayAyah = (index) => {

        this.props.surah.playing = (!this.props.surah.playing) ? true : this.props.surah.playing;

        this.setState((state) => {
            const playing = new Map(state.playing);
            playing.set(index, !playing.get(index));
            return { playing };
        });

        let track = this.props.surah.ayahList[index].audio;

        // Lecture audio
        this.player = new Sound(track, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else {
                // Play the sound with an onEnd callback
                this.player.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');

                        // playing => !playing
                        this.setState((state) => {
                            const playing = new Map(state.playing);
                            playing.set(index, !playing.get(index));
                            return { playing };
                        });

                        // S'il reste des ayahs, on lit la suivante
                        if (index+1 in this.props.surah.ayahList) {
                            // Lecture de la piste suivante
                            this._onPlayAyah(index+1);
                        }

                        // S'il n'y a plus de pistes on libbère le flux audio
                        else {
                            this.props.surah.playing = false;
                            this.player.release();
                        }
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }
        });

    };

    _renderHeader = () => {
        
        return (
            <LectureHeader
                style={styles.lectureHeader}
                onPressSurah={this._onPressSurah}
                onPlaySurah={this._onPlaySurah}
                onPlayPauseSurah={this._onPauseSurah}
            />
        )
    };

    _renderSeparator = () => {
        return (
            <View
                style={{
                    height: 3,
                    width: "100%",
                    backgroundColor: "#ffffff",
                }}
            />
        )
    };

    _renderItem = (item) => {
        item = item.item;

        return (
            <Ayah
                onPressItem={this._onPressItem}
                onPlayAyah={this._onPlayAyah}
                selected={!!this.state.selected.get(item.numberInSurah)}
                data={item}
                numberInSurah={item.numberInSurah}
                index={item.index}
            />
        )
    };

    _onPressItem = (index) => {
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(index, !selected.get(index));
            return { selected };
        });
    };

    _keyExtractor = (item) => {
        return item.index
    }

    render() {

        // Une fois chargé, on affiche la vue
        if (!this.props.surah.loading) {

            return (
                <View style={styles.superContainer}>
                    <ImageBackground
                        resizeMode={"center"}
                        style={styles.sourateContainer}
                        imageStyle={styles.backgroundImage}
                        source={require('../../assets/patterns/hd_overlay.png')} >
                        <FlatList
                            data={this.props.surah.ayahList}
                            renderItem={this._renderItem}
                            extraData={this.state}
                            ListHeaderComponent={this._renderHeader}
                            ItemSeparatorComponent={this._renderSeparator}
                            keyExtractor={this._keyExtractor}
                        />
                    </ImageBackground>
                </View>
            );

        }

        // Indicateur de chargement
        else {
            console.log('on render a nouveau parce que on a des props super cools');
            return (
                <ImageBackground
                    resizeMode={"center"}
                    style={styles.activityIndicatorContainer}
                    imageStyle={styles.backgroundImage}
                    source={require('../../assets/patterns/hd_overlay.png')} >
                    <ActivityIndicator
                        animating={true}
                        size="large"
                        color='#ffffff'
                        style={styles.activityIndicator} />
                </ImageBackground>
            );
        }

    }
}

const styles = StyleSheet.create({
    activityIndicatorContainer: {
        backgroundColor: '#2D5068',
    },
    activityIndicator: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    sourateContainer: {
        flexDirection: 'column',
        backgroundColor: '#efefef',
    },
    lectureHeader: {
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,1)',
        position:'absolute',
        top:0,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PageLecture);
