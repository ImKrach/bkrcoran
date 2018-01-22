import React from 'react';
import {
	Text,
	Image,
	View,
	AsyncStorage,
} from 'react-native'
import { CheckBox } from "react-native-elements";

import generalStyles                                   from '../style'
import { connect } from 'react-redux'
import { toggleArabe, toggleFrancais, togglePhonetique} from '../actions'

const mapStateToProps = (state) => {
    return {
        params: state.settingsReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleArabe: (checked) => dispatch(toggleArabe(checked)),
        toggleFrancais: (checked) => dispatch(toggleFrancais(checked)),
        togglePhonetique: (checked) => dispatch(togglePhonetique(checked)),
    };
};

class PageParametres extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Parametres',
        tabBarIcon: ({ tintColor }) => (
            <Image style={generalStyles.menuImage} source={require('../../assets/icons/settings-gears-white.png')}/>
        ),
    };

    constructor (props) {
        super(props)
    }
    
    componentDidMount() {
        this.getTextSettings()
    }
	
	async getTextSettings() {
	    await AsyncStorage.getItem('textSettings', (error, response) => {
            if (error) {
                console.log("get textSettings error : ", error);
            } else {
                let textSettings = JSON.parse(response) || [];
                
                if (textSettings) {
                    this.props.toggleArabe(textSettings.arabe)
                    this.props.toggleFrancais(textSettings.francais)
                    this.props.togglePhonetique(textSettings.phonetique)
                }
            }
        });
	}
    
    async updateSettings(settings) {
	    await AsyncStorage.setItem('textSettings', JSON.stringify(settings), (error) => {
            if (error) {
                console.log('save textSettings error : ', error)
            } else {
                console.log("successfully saved settings : ", settings);
            }
	    });
    }

    render() {
        return (
            <View>
                <Text>Paramètres</Text>
                <CheckBox
                    center
                    title='Arabe'
                    iconRight
                    checkedIcon='check-square-o'
                    uncheckedIcon='square-o'
                    checkedColor='green'
                    uncheckedColor='#cccccc'
                    checked={this.props.params.arabe}
                    onPress={() => {
                        this.props.toggleArabe(!this.props.params.arabe).then(() => {
                        	this.updateSettings(this.props.params)
                        })
                    }}
                />
                <CheckBox
                    center
                    title='Français'
                    iconRight
                    checkedIcon='check-square-o'
                    uncheckedIcon='square-o'
                    checkedColor='green'
                    uncheckedColor='#cccccc'
                    checked={this.props.params.francais}
                    onPress={() => {
                        this.props.toggleFrancais(!this.props.params.francais).then(() => {
	                        this.updateSettings(this.props.params)
                        })
                    }}
                />
                <CheckBox
                    center
                    title='Phonétique'
                    iconRight
                    checkedIcon='check-square-o'
                    uncheckedIcon='square-o'
                    checkedColor='green'
                    uncheckedColor='#cccccc'
                    checked={this.props.params.phonetique}
                    onPress={() => {
                        this.props.togglePhonetique(!this.props.params.phonetique).then(() => {
	                        this.updateSettings(this.props.params)
                        })
                    }}
                />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageParametres)
