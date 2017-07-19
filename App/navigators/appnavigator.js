import React, { Component } from 'react';
import {Text} from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';


import ActorList    from '../components/actor-list-view';
import Home         from '../components/home-view';
import MainMenu     from '../components/main-menu-view';
import SendPortCall from '../components/send-portcall-view';
import StateList    from '../components/state-list-view';
import PortCallList from '../components/portcall-list-view';
import TimeLineView from '../components/timeline-view';
import FilterMenu   from '../components/portcall-list-view/sections/filterMenu';
import StateDetails from '../components/timeline-view/sections/statedetails';


export const PortCallNavigator = StackNavigator({
  PortCallList: { screen: PortCallList},
  TimeLineDetails: {screen: TimeLineView},
  StateDetails: { screen: StateDetails}, 
  StateList: { screen: StateList },
}, {
  navigationOptions: {
    gesturesEnabled: false
  },
  headerMode: 'none'
});

export const AppNavigator = DrawerNavigator({
  PortCalls: { screen: PortCallNavigator },
  Home: { screen: Home },  
  ActorSelection: { screen: ActorList },
  MainMenu: { screen: MainMenu },
  SendPortCall: { screen: SendPortCall },
  FilterMenu: {screen: FilterMenu},
}, {
  headerMode: 'none'
});

