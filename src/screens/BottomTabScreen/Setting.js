import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import colors from '../../theme/colors';
import CoacheeSettingScreen from './SettingModule/CoacheeSettingScreen';
import CoachSettingScreen from './SettingModule/CoachSettingScreen';
import { useSelector } from 'react-redux';

const Setting = ({ navigation }) => {
    const { role } = useSelector((state) => state.userLogin)
    return (
        <SafeAreaView style={styles.container}>

            {
                role === 'coachee' ? <CoacheeSettingScreen navigation={navigation} /> :
                    <CoachSettingScreen navigation={navigation} />
            }

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

export default Setting;
