import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

// import {
//     Icon,
// } from 'react-native-elements';

import colorScheme from '../../../config/colors';

const BerthHeader = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Events for {props.location.name}</Text>
        </View>
    );
};

BerthHeader.propTypes = {
    location: PropTypes.object.isRequired,
}

export default BerthHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScheme.primaryColor,
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: colorScheme.primaryTextColor,
    }
});