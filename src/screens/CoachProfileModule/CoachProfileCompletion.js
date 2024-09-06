//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedProfile from '../../components/AnimatedProfileComponent';

// create a component
const CoachProfileCompletion = ({navigation}) => {
    return (
        <View style={styles.container}>
            <AnimatedProfile percentage={100} role={'coach'} navigation={navigation} />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 109, 106, 1)',
    },
});

//make this component available to the app
export default CoachProfileCompletion;
