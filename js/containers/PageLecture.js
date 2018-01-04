import React from 'react'
import { StyleSheet,
    View,
    FlatList,
    Image,
    Platform,
    ImageBackground,
    ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { fetchSurah, fetchSurahList, updateSurahPlayer } from '../actions'
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
        updateSurahPlayer: (playing, surahIndex, ayahIndex) => dispatch(updateSurahPlayer(playing, surahIndex, ayahIndex)),
    };
};

class PageLecture extends React.PureComponent {
  static navigationOptions = {
    tabBarLabel: "Lecture",
    tabBarIcon: ({ tintColor }) => (
      <Image
        style={generalStyles.menuImage}
        source={require("../../assets/icons/reading-quran-white.png")}
      />
    )
  };

  constructor(props) {
    super(props);

    // Enable playback in silence mode
    Sound.setCategory("Playback");

    this.state = {
      selected: new Map(),
      player: {
        ayahIndex: 0,
        surahIndex: 0
      }
    };
  }

  componentWillMount() {
    // Récupération de L'Ouverture
    this.props.getSurah(1).then(() => {
      this.setState(state => {
        const player = state.player;
        player.ayahIndex = null;
        player.surahIndex = null;
        player.url = null;
        return { player };
      });
    });

    // Récupération de la liste des sourates du Coran
    this.props.getSurahList();
  }

  // Si de nouvelles propriétés sont reçues
  componentWillReceiveProps(nextProps) {}

  // Demande de la sourate #surahNumber
  _onPressSurah = surahIndex => {
    // Récupération de la sourate demandée
    this.props.getSurah(surahIndex).then(() => {
      this.setState(state => {
        const player = state.player;
        player.ayahIndex = null;
        player.surahIndex = null;
        player.url = null;
        return { player };
      });
    });
  };

  // Clique sur le bouton de la sourate (celui du header)
  _onHeaderPlaySurah = surahNumber => {
    if (this.player instanceof Sound) {
      if (this.props.surah.playing) {
        this.player.pause();
      } else {
        this.player.play(() => {
          // S'il reste des ayahs, on lit la suivante
          if (this.state.player.ayahIndex + 1 in this.props.surah.ayahList) {
            // Lecture de la piste suivante
            this.playAyah(this.state.player.ayahIndex + 1);
          }
        });
      }

      // Mise à jour de l'état playing
      this.props.updateSurahPlayer(
        !this.props.surah.playing,
        this.props.surah.surahIndex,
        this.state.player.ayahIndex
      );
    } else {
      this.playAyah(0);
    }
  };

  playAyah = ayahIndex => {
    // On force playing à vrai
    let surahIndex = this.props.surah.surahIndex;
    this.props.updateSurahPlayer(true, surahIndex, ayahIndex);

    let track = this.props.surah.ayahList[ayahIndex].audio;

    // Lecture audio
    this.player = new Sound(track, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("failed to load the sound", error);
      } else {
        this.setState(state => {
          const player = state.player;
          player.ayahIndex = ayahIndex;
          player.surahIndex = surahIndex;
          player.url = track;
          return { player };
        });

        // Play the sound with an onEnd callback
        this.player.play(success => {
          if (success) {
            // playing => !playing
            this.setState(state => {
              const player = state.player;
              player.ayahIndex = null;
              player.surahIndex = null;
              player.url = null;
              return { player };
            });

            // S'il reste des ayahs, on lit la suivante
            if (ayahIndex + 1 in this.props.surah.ayahList) {
              // Lecture de la piste suivante
              this.playAyah(ayahIndex + 1);
            } else {
              // S'il n'y a plus de pistes on libbère le flux audio
              this.props.updateSurahPlayer(false, surahIndex, ayahIndex);
              this.player.release();
            }
          } else {
            // playing => !playing
            this.setState(state => {
              const player = state.player;
              player.ayahIndex = null;
              player.surahIndex = null;
              player.url = null;
              return { player };
            });
          }
        });
      }
    });
  };

  _renderHeader = () => {
    return (
      <LectureHeader
        style={styles.lectureHeader}
        onPressSurah={surahIndex => this._onPressSurah(surahIndex)}
        onPlayPauseSurah={surahIndex => this._onHeaderPlaySurah(surahIndex)}
        prepareSurah={ (surahIndex) => {
            for (let i = 0; i < this.props.surah.ayahList.length; i++) {
                this.props.surah.ayahList[i].player = new Sound(
                    this.props.surah.ayahList[i].audio,
                    Sound.MAIN_BUNDLE,
                    (error, sound) => {
                        if (error) {
                            console.log("failed to load the sound", error);
                        } else {
                            console.log("sound loaded successfully");
                            if (i === 0) {
                                this.setState(state => {
                                    const player = state.player;
                                    player.ayahIndex = 0;
                                    player.surahIndex = surahIndex;
                                    player.url = this.props.surah.ayahList[0].audio;
                                    return { player };
                                });
                                this.props.surah.ayahList[0].player.play(this._callbackPerso);
                            }
                        }
                    }
                );
            }
        }}
      />
    );
  };

  _callbackPerso = (success) => {
      let ayahIndex = this.state.player.ayahIndex;
      let nextAyahIndex = ayahIndex + 1;
      console.log('lecture de ', ayahIndex)
      console.log('prochaine lecture ', nextAyahIndex)
      
    if (success) {
      // Release de la ressource
      this.props.surah.ayahList[ayahIndex].player.release();

      // S'il reste des ayahs, on lit la suivante
      if (
          nextAyahIndex in this.props.surah.ayahList
          && this.props.surah.ayahList[nextAyahIndex] != undefined
        ) {
        this.setState(state => {
          const player = state.player;
          player.ayahIndex = nextAyahIndex;
          player.surahIndex = this.props.surah.surahIndex;
          player.url = this.props.surah.ayahList[nextAyahIndex].audio;
          return { player };
        });
        // Lecture de la piste suivante
        this.props.surah.ayahList[nextAyahIndex].player.play(this._callbackPerso);
      } else {
        // playing => !playing
        this.setState(state => {
          const player = state.player;
          player.ayahIndex = null;
          player.surahIndex = null;
          player.url = null;
          return { player };
        });
      }

    } else {
        this.setState(state => {
          const player = state.player;
          player.ayahIndex = null;
          player.surahIndex = null;
          player.url = null;
          return { player };
        });

    }
  };

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 3,
          width: "100%",
          backgroundColor: "#ffffff"
        }}
      />
    );
  };

  _renderItem = item => {
    item = item.item;

    return (
      <Ayah
        onPressItem={this._onPressItem}
        onPlayAyah={ayahIndex => this.playAyah(ayahIndex)}
        selected={!!this.state.selected.get(item.ayahNumber)}
        data={item}
        ayahNumber={item.ayahNumber}
        ayahIndex={item.ayahIndex}
      />
    );
  };

  _onPressItem = index => {
    this.setState(state => {
      const selected = new Map(state.selected);
      selected.set(index, !selected.get(index));
      return { selected };
    });
  };

  _keyExtractor = item => {
    return item.index;
  };

  render() {
    // Une fois chargé, on affiche la vue
    if (!this.props.surah.loading) {
      return (
        <View style={styles.superContainer}>
          <ImageBackground
            resizeMode={"center"}
            style={styles.sourateContainer}
            imageStyle={styles.backgroundImage}
            source={require("../../assets/patterns/hd_overlay.png")}
          >
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
    } else {
      // Indicateur de chargement
      console.log("on render a nouveau parce que on a des props super cools");
      return (
        <ImageBackground
          resizeMode={"center"}
          style={styles.activityIndicatorContainer}
          imageStyle={styles.backgroundImage}
          source={require("../../assets/patterns/hd_overlay.png")}
        >
          <ActivityIndicator
            animating={true}
            size="large"
            color="#ffffff"
            style={styles.activityIndicator}
          />
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
