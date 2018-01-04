import React from 'react'
import { Header, Button } from 'react-native-elements'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";

import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        surah: state.surahReducer,
        surahList: state.surahListReducer,
    };
};

class LectureHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
        };

        this.icons = {
            'play': { name: 'play-circle', type: 'font-awesome' },
            'pause': { name: 'pause-circle', type: 'font-awesome' },
            'expand': { name: 'chevron-circle-down', type: 'font-awesome' },
            'collapse': { name: 'chevron-circle-up', type: 'font-awesome' },
        }
    }

    componentWillReceiveProps (nextProps) {
        
    }

    _renderCenterComponent() {
        return (
            <TouchableWithoutFeedback onPress = {() => {
                this.props.prepareSurah(this.props.surah.surahIndex)
            }}>
                <View style={styles.titreSourateView} >
                    <Text style={styles.titreSourate}>{this.props.surah.name}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderLeftComponent() {
        let expandIcon;

        if (this.state.isExpanded) {
            expandIcon = this.icons.collapse
        } else {
            expandIcon = this.icons.expand
        }

        return (
            <View>
                <Button
                    fontSize={14}
                    buttonStyle={styles.boutonHeaderLecture}
                    icon={expandIcon}
                    onPress={ () => {
                        this.setState(previousState => {
                          return { isExpanded: !previousState.isExpanded };
                        });
                    }}
                />
            </View>
            )
        }

    _renderRightComponent() {
        let playerIcon;

        if (this.props.surah.playing) {
          playerIcon = this.icons.pause;
        } else {
          playerIcon = this.icons.play;
        }

        return (
            <View>
                <Button
                    fontSize={14}
                    buttonStyle={styles.boutonHeaderLecture}
                    icon={playerIcon}
                    onPress={() => {
                        this.props.onPlayPauseSurah(this.props.surah.surahIndex);
                    }}
                />
            </View>
        )
    }

    _renderItemSurahListSeparator = () => {
        return null
    };

    _keyExtractor = (item) => item.surahIndex;

    _renderItemSurahList = ({item}) => {
        let playerIcon

        if (item.playing) {
          playerIcon = this.icons.pause;
        } else {
          playerIcon = this.icons.play;
        }

        if (this.state.isExpanded) {
            return (
                <TouchableWithoutFeedback onPress={() => {
                    this.props.onPressSurah(item.surahIndex)
                    this.setState( {isExpanded: !this.state.isExpanded})
                }} >
                    <View style={styles.surahListItemContainer}>
                        <View style={[styles.surahListItem]}>
                            <Button
                                fontSize={18}
                                buttonStyle={styles.boutonHeaderLecture}
                                icon={playerIcon} />
                        </View>
                        <View style={[styles.surahListItem, {flex:3}]}>
                            <Text style={{color:'#fffce8', fontSize:18}}>
                                {item.name}
                            </Text>
                            <Text style={{color:'#fffce8', fontSize:14}}>
                                {item.surahNumber + ". " + item.nameTranslated}
                            </Text>
                        </View>
                        <View style={[styles.surahListItem, {flex:1}]}>
                            <Text style={{color:'#fffce8', fontSize:14}}>
                                {item.size + "v."}
                            </Text>
                            <Text style={{color:'#fffce8', fontSize:14}}>
                                {item.revelationPlace}
                            </Text>
                        </View>
                    </View>

                </TouchableWithoutFeedback>
            )
        } else {
            return null
        }
    };

    _renderHeader = () => {
        return (
            <Header
                backgroundColor='transparent'
                outerContainerStyles={styles.headerOutterContainer}
                innerContainerStyles={styles.headerInnerContainer}
                leftComponent={this._renderLeftComponent()}
                centerComponent={this._renderCenterComponent()}
                rightComponent={this._renderRightComponent()}
            />
        )
    };

    render () {
        return (
            <FlatList
                ref='_header'
                data={this.props.surahList.surahList}
                renderItem={this._renderItemSurahList}
                ListHeaderComponent={() => this._renderHeader(this)}
                ItemSeparatorComponent={this._renderItemSurahListSeparator}
                keyExtractor={this._keyExtractor}
                style={{backgroundColor:'#204965'}}
            />
        )
    }

}

const styles = StyleSheet.create({
    headerMainContainer: {
        backgroundColor: 'transparent',
        borderBottomWidth:0,
        borderBottomColor: 'transparent',
    },
    headerInnerContainer: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerOutterContainer: {
        height:50,
        borderWidth:0,
        marginBottom:0,
    },
    boutonHeaderLecture: {
        backgroundColor:'transparent',
    },
    titreSourateView: {
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titreSourate: {
        color: '#fffce8',
        fontSize:20,
    },
    surahListItemContainer: {
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',
        paddingVertical:10,
    },
    surahListItem:{
        // backgroundColor: '#325f77',
        backgroundColor: 'transparent',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default connect(mapStateToProps)(LectureHeader);