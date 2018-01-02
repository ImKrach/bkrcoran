import React from 'react';
import { Text, Image } from 'react-native';

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
    }

    render() {
        return (
            <Text>Paramètres</Text>
        );
    }
}
