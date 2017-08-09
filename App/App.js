import React, { Component } from 'react';
import { AsyncStorage, ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';

import {fetchLocations} from './actions';

import reducers from './reducers';
import colorScheme from './config/colors';

import { MenuContext } from 'react-native-popup-menu';

import {LoginNavigator, AppNavigator} from './navigators/appnavigator';

const store = compose(autoRehydrate(), applyMiddleware(ReduxThunk))(createStore)(reducers);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rehydrated: false,
    }

  }

  componentWillMount() {
    let persistore = persistStore(store, {whitelist: ['states', 'settings', 'filters'], storage: AsyncStorage}, () => {
      this.setState({rehydrated: true})
    });
    // persistore.purge();
  }


  render() {
    if(!this.state.rehydrated) {
      return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator color={colorScheme.primaryColor} size='large' /></View>
    } else {
        return (
          <Provider store={store}>
            <MenuContext>
              <AppNavigator />
            </MenuContext>
         </Provider>
        );
    }
  }
}

export default App;