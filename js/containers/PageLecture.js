import React from "react";
import { NavigationActions } from 'react-navigation';
import {
	StyleSheet,
	View,
	FlatList,
	Image,
	Platform,
	ImageBackground,
	ActivityIndicator,
	AsyncStorage,
	SectionList
} from "react-native";
import { connect } from "react-redux";
import { fetchSurah, fetchSurahList, updateSurahPlayer } from "../actions";
import generalStyles from "../style";
import Ayah from "../components/Ayah";
import LectureHeader from "../components/LectureHeader";

import Sound from "react-native-sound";

const mapStateToProps = state => {
	return {
		surah: state.surahReducer,
		surahList: state.surahListReducer,
		settings: state.settingsReducer
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getSurah: surahNumber => dispatch(fetchSurah(surahNumber)),
		getSurahList: () => dispatch(fetchSurahList()),
		updateSurahPlayer: (playing, surahIndex, ayahIndex) =>
			dispatch(updateSurahPlayer(playing, surahIndex, ayahIndex))
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
		),
		tabBarVisible:true,
	};

	constructor(props) {
		super(props);

		// Enable playback in silence mode
		// Sound.setCategory("Playback");

		this.state = {
			selected: new Map(),
			player: {
				ayahIndex: 0,
				surahIndex: 0
			}
		};
	}

	componentWillUnmount() {}

	componentWillMount() {
		// this.props.navigation.setParams({ visible: true });
		this.fetchDatas();
	}
	
	componentDidMount() {
		// this.fetchDatas();
	}

	async fetchDatas() {
		let startingSurah = 1;

		try {
			let test = await AsyncStorage.getItem("surahNumber");
			if (!isNaN(test)) {
				startingSurah = test >= 1 && test <= 114 ? test : 1;
			}
			this.props.getSurah(startingSurah);
			this.props.getSurahList();
		} catch (error) {
			console.log('caught error async', error);
		}
	}

	// Si de nouvelles propriétés sont reçues
	componentWillReceiveProps(nextProps) {

	}

	// Demande de la sourate #surahNumber
	_onPressSurah = surahNumber => {
		// Récupération de la sourate demandée
		this.props.getSurah(surahNumber).then(() => {
			this.sectionList.scrollToLocation({
				itemIndex: 0,
				sectionIndex: 0,
				animated: true,
			});
		});

		AsyncStorage.setItem("surahNumber", JSON.stringify(surahNumber))
			.then(error => {
				if (error) {
					console.log("storage set surahNumber fail", error);
				}
			})
			.done();
	};

	// Clique sur le bouton de la sourate (celui du header)
	_onHeaderPlaySurah = surahNumber => {
		if (this.player instanceof Sound) {
			if (this.props.surah.playing) {
				this.player.pause();
			} else {
				this.player.play(() => {
					// S'il reste des ayahs, on lit la suivante
					if (
						this.state.player.ayahIndex + 1 in
						this.props.surah.ayahList
					) {
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
		this.player = new Sound(track, Sound.MAIN_BUNDLE, error => {
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
							this.props.updateSurahPlayer(
								false,
								surahIndex,
								ayahIndex
							);
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

	_test = (expanded) => {
		const setParamsAction = NavigationActions.setParams({
			params: { navigationOptions: { tabBarVisible: !expanded } },
			key: 'Lecture',
		});
		this.props.navigation.dispatch(setParamsAction);
	}

	_renderHeader = (section) => {
		return (
			<LectureHeader
				style={styles.lectureHeader}
				toggleBar={expanded => this._test(expanded)}
				onPressSurah={surahNumber => this._onPressSurah(surahNumber)}
				onPlayPauseSurah={surahIndex =>
					this._onHeaderPlaySurah(surahIndex)
				}
				prepareSurah={surahIndex => {
					for (let i = 0; i < this.props.surah.ayahList.length; i++) {
						this.props.surah.ayahList[i].player = new Sound(
							this.props.surah.ayahList[i].audio,
							Sound.MAIN_BUNDLE,
							(error, sound) => {
								if (error) {
									console.log(
										"failed to load the sound",
										error
									);
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
										this.props.surah.ayahList[0].player.play(
											this._callbackPerso
										);
									}
								}
							}
						);
					}
				}}
			/>
		);
	};

	_callbackPerso = success => {
		let ayahIndex = this.state.player.ayahIndex;
		let nextAyahIndex = ayahIndex + 1;

		if (success) {
			// Release de la ressource
			this.props.surah.ayahList[ayahIndex].player.release();

			// S'il reste des ayahs, on lit la suivante
			if (
				nextAyahIndex in this.props.surah.ayahList &&
				this.props.surah.ayahList[nextAyahIndex] != undefined
			) {
				this.setState(state => {
					const player = state.player;
					player.ayahIndex = nextAyahIndex;
					player.surahIndex = this.props.surah.surahIndex;
					player.url = this.props.surah.ayahList[nextAyahIndex].audio;
					return { player };
				});
				// Lecture de la piste suivante
				this.props.surah.ayahList[nextAyahIndex].player.play(
					this._callbackPerso
				);
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

	_renderItem = ({item}) => {
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
		return item.ayahIndex;
	};

	handleAyahScroll = event => {
		this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
	};

	render() {
		// Une fois chargé, on affiche la vue
		if (!this.props.surah.loading) {
			return <View style={styles.superContainer}>
					<ImageBackground resizeMode={'center'} style={styles.sourateContainer} imageStyle={styles.backgroundImage} source={require('../../assets/patterns/hd_overlay.png')}>
						<SectionList sections={[{ title: this.props.surah.name, data: this.props.surah.ayahList }]} renderItem={this._renderItem} extraData={this.state} renderSectionHeader={this._renderHeader} ItemSeparatorComponent={this._renderSeparator} keyExtractor={this._keyExtractor} onScroll={this.handleAyahScroll} ref={sectionList => (this.sectionList = sectionList)} initialScrollIndex={0} stickySectionHeadersEnabled={true} />
					</ImageBackground>
				</View>;
		} else {
			// Indicateur de chargement
			return (
				<ImageBackground
					resizeMode={"center"}
					style={styles.activityIndicatorContainer}
					imageStyle={styles.loaderBackground}
					source={require("../../assets/patterns/hd_overlay.png")}
				>
					<ActivityIndicator
						animating={true}
						size="large"
						color="#000000"
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
		overlayColor: '#2D5068',
	},
	activityIndicator: {
		flex: 1,
		alignSelf: 'center',
		justifyContent: 'center',
	},
	sourateContainer: {
		flexDirection: 'column',
		backgroundColor: '#fffce8',
	},
	lectureHeader: {
		borderWidth: 3,
		borderColor: 'rgba(255,255,255,1)',
		position: 'absolute',
		top: 0,
	},
	loaderBackground: {
		backgroundColor: '#2D5068',
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(PageLecture);
