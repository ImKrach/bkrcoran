import React from 'react'
import { Text, Image } from 'react-native'

import generalStyles from '../style'


export default class PageHadiths extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Hadiths',
        tabBarIcon: ({ tintColor }) => (
            <Image style={generalStyles.menuImage} source={require('../../assets/icons/muslim-man-white.png')}/>
        ),
    };

    constructor (props) {
        super(props)
    }

    render() {
        return (
            <Text>Hadiths</Text>
        );
    }
}
