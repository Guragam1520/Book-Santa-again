import React from 'react';
import { Image } from 'react-native';
import BookDonateScreen from '../screens/BookDonateScreen';
import RecieverDetailsScreen from '../screens/RecieverDetailsScreen';
import {createStackNavigator} from 'react-navigation-stack';

export const AppStackNavigator=createStackNavigator({
    BookDonateList:{
        screen:BookDonateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    RecieverDetails:{
        screen:RecieverDetailsScreen,
        navigationOptions:{
            headerShown:false
        }
    }
},
{initialRouteName:"BookDonateList"})