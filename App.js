import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StatusBar, View } from 'react-native';

import ReactCoran from './js/ReactCoran';
import configureStore from './js/store';

const store = configureStore();

// App
export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<View style={{ flex: 1 }}>
					<StatusBar hidden={true} />
					<ReactCoran />
				</View>
			</Provider>
		);
	}
}
