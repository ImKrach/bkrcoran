import React from 'react';
import { Text, Image, View } from 'react-native';
import { CheckBox } from "react-native-elements";

import generalStyles from '../style'

export default class PageParametres extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Parametres',
        tabBarIcon: ({ tintColor }) => (
            <Image style={generalStyles.menuImage} source={require('../../assets/icons/settings-gears-white.png')}/>
        ),
    };

    constructor (props) {
        super(props)

        this.state = {
            checked:true
        }
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
                    checked={this.state.checked}
                />
                <CheckBox
                    center
                    title='Français'
                    iconRight
                    checkedIcon='check-square-o'
                    uncheckedIcon='square-o'
                    checkedColor='green'
                    uncheckedColor='#cccccc'
                    checked={this.state.checked}
                />
                <CheckBox
                    center
                    title='Phonétique'
                    iconRight
                    checkedIcon='check-square-o'
                    uncheckedIcon='square-o'
                    checkedColor='green'
                    uncheckedColor='#cccccc'
                    checked={this.state.checked}
                />
            </View>
        );
    }
}
