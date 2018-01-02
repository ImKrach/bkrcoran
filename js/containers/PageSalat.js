import React from 'react'
import { Text, Image } from 'react-native'

import generalStyles from '../style'

export default class PageSalat extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Salat',
        tabBarIcon: ({ tintColor }) => (
            <Image style={generalStyles.menuImage} source={require('../../assets/icons/muslim-praying-white.png')}/>
        ),
    };

    constructor (props) {
        super(props)
    }

    render() {
        return (
            <Text>Horaires de salat</Text>
        );
    }
}
