import React, { Component } from 'react';
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native';

import { 
  Text,
  Icon,
  Button,
  SideMenu
} from 'react-native-elements';

import colorScheme from '../../config/colors';

// Class showing the first header. The header should later adjust to other pages. 
export default class TopHeader extends Component {

  render() {
    const {title, firstPage, rightIconFunction} = this.props;

    
    return(
      <View >
        <View style={styles.container}>
          {/* On the landing page on IOS, and all pages on android we want to show a meny icon */}
          {(firstPage || Platform.OS === 'android') && 
          <Icon
            name= 'menu'
            color= {colorScheme.primaryContainerColor}
            size= {50}
            onPress={() => this.props.navigation.navigate('DrawerOpen')}
          /> 
          }
          {/* But on all other pages on IOS, we want to show a back button  */}
          {(!firstPage && Platform.OS === 'ios') &&
          <Icon
            name= 'arrow-back'
            color= {colorScheme.primaryContainerColor}
            size= {50}
            onPress={() => this.props.navigation.goBack()}
          /> 
          }
          <Text 
            style= {styles.headerText} 
            h4 
          >
            {title}
          </Text>
          <Icon
            name='add-circle'
            size = {50}
            color= {colorScheme.primaryContainerColor}
            onPress={() => rightIconFunction()}
          />
        </View>
    </View>
    );
  }
}
// 
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryColor,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
      color: colorScheme.primaryTextColor,
  },
  signText: {
    color: colorScheme.primaryTextColor,
  },
});