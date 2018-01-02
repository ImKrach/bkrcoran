import React from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native'
import { Button, Badge, Icon } from 'react-native-elements'

export default class Ayah extends React.Component {

    constructor(props) {
        super(props)
    }

    _expand() {
        if (this.props.selected) {
            return (
                <View style={styles.conteneurExpand} >
                    <Text>{this.props.data.tafsir}</Text>
                    <Button
                        backgroundColor="#2D5068"
                        onPress={() => this.props.onPlayAyah(this.props.index)}
                        icon={{ name: 'play', type: 'font-awesome' }}
                        containerViewStyle={{flexWrap:'wrap',justifyContent:'center', alignSelf:'center', alignItems:'center', marginVertical:8}}
                        borderRadius={10}
                    />
                </View>
            )
        }
    }

    _onPress = () => {
        this.props.onPressItem(this.props.numberInSurah);
    };

    render() {
        return (
            <TouchableNativeFeedback {...this.props} style={styles.sectionAyah} onPress={this._onPress} >
                <View style={[styles.conteneurAyah]}>
                    <Badge containerStyle={styles.conteneurAyahNumber}>
                        <Text style={styles.ayahNumberText}>{this.props.data.numberInSurah}</Text>
                    </Badge>
                    <View style={styles.conteneurAyahText} >
                        <Text style={styles.ayahText}>{this.props.data.text}</Text>
                    </View>
                    {this._expand()}
                </View>
            </TouchableNativeFeedback>
        )
    }

}

const styles = StyleSheet.create({

    conteneurAyah: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(33,33,33,0.1)',
    },
    conteneurExpand: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        marginHorizontal: 10,
        borderTopWidth: 1,
        borderColor: '#000000',
    },
    conteneurAyahNumber: {
        height: 20,
        marginTop: 5,
        alignSelf: 'center',
        backgroundColor: '#2D5068',
    },
    ayahNumberText: {
        color: '#ffffff',
        fontSize: 12,
        textAlignVertical: 'center',
    },
    conteneurAyahText: {
        paddingHorizontal: 5,
        paddingVertical: 8,
        alignSelf: 'flex-end',
    },
    ayahText: {
        fontSize: 22,
        color:'#000000',
    },
});

// dark red #800000
// darker red #400000
// dark blue #2D5068
// darker blue #021631
// dark green #3B6B00
// darker green #294A00

// light gold #eae374
// light grey #e5e5e5
// medium beige #c6c386