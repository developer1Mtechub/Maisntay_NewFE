import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import fonts from '../../theme/fonts';
import colors from '../../theme/colors';
import CustomButton from '../../components/ButtonComponent';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { resetNavigation } from '../../utilities/resetNavigation';
import useCustomTranslation from '../../utilities/useCustomTranslation';

const WellcoinsScreen = ({ navigation }) => {
    const {t} = useCustomTranslation();

    return (
        <ImageBackground style={styles.container}
            source={require('../../assets/images/coins_animation.gif')}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ width: 324, height: 304 }}
                    source={require('../../assets/images/payment_success_img.png')}
                />
                <Text style={{
                    fontFamily: fonts.fontsType.bold,
                    fontSize: 22,
                    color: colors.primaryColor,
                    marginTop: 20,
                }}>{t('congratulations')}</Text>
                <Text style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: 14,
                    color: colors.blackTransparent,
                    marginTop: 20,
                }}>{t('receivedWellcoins')}</Text>
            </View>
            <CustomButton
                onPress={() => {
                    resetNavigation(navigation, "Dashboard", { screen: "MyCoaching" })
                }}
                title={t('goBack')}
                customStyle={{
                    top: heightPercentageToDP('13%'),
                    width: widthPercentageToDP('80%')
                }}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default WellcoinsScreen;
