//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import useCustomTranslation from '../../../utilities/useCustomTranslation';

// create a component
const HomeWelcome = () => {
    const { t } = useCustomTranslation();
    return (
        <View style={styles.container}>
            <Image style={{ width: 283, height: 219, marginVertical:40 }} source={require('../../../assets/images/coach_welcome_img.png')} />

            <Text style={{
                color: colors.primaryColor,
                fontFamily: fonts.fontsType.bold,
                fontSize: 21,
                lineHeight: 27,
                
            }}>{t('coachWelcomeText1')}</Text>

            <Text style={{
                color: colors.blackTransparent,
                fontFamily: fonts.fontsType.medium,
                fontSize: 15,
                lineHeight: 24,
                textAlign:'center',
                marginVertical:10
            }}>{t('coachWelcomeText2')}</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
});

//make this component available to the app
export default HomeWelcome;
