import { TabNavigator } from 'react-navigation'

import PageLecture from './containers/PageLecture'
import PageSalat from './containers/PageSalat'
import PageHadiths from './containers/PageHadiths'
import PageParametres from './containers/PageParametres'

// Configuration du TabNavigator
export default ReactCoran = TabNavigator({
    Lecture: {
        screen: PageLecture,
        navigationOptions: {
            tabBarVisible:true,
        }
    },
    Salat: {
        screen: PageSalat,
    },
    Hadith: {
        screen: PageHadiths,
    },
    Parametres: {
        screen: PageParametres,
    }
}, {
        tabBarPosition: 'bottom',
        animationEnabled: false,
        tabBarOptions: {
            allowFontScaling: true,
            activeTintColor: '#ffffff',
            inactiveTintColor: '#ffffff',
            tintColor:'#ffffff',
            showIcon: true,
            showLabel: false,
            labelStyle: {
                // fill: '#ffffff',
                color:'#ffffff',
            },
            iconStyle: {
                // fill:'#ffffff',
                // height:64,
                // width:64,
            },
            // activeBackgroundColor: '#2D5068',
            style: {
                backgroundColor: '#2D5068',
            },
            indicatorStyle: {
                height: 2,
                backgroundColor: '#ffffff',
            }
        },
    });
