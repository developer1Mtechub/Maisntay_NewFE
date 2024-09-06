import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import BackArrow from '../../../assets/svgs/back_arrow_white.svg';
import { resetNavigation } from '../../../utilities/resetNavigation';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import useCustomTranslation from '../../../utilities/useCustomTranslation';

const MyWalletHeader = ({ amount, onWithdraw, navigation, status, route }) => {
    const { t } = useCustomTranslation()
    return (
        <ImageBackground
            source={require('../../../assets/images/my_wallet_bg.png')} // Replace 'backgroundImage.jpg' with your image path
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <TouchableOpacity
                onPress={() => {
                    if (route === 'NotificationList') {
                        resetNavigation(navigation, "NotificationList")
                    } else {
                        resetNavigation(navigation, "Dashboard", { screen: "Setting" })
                    }
                }}
                style={styles.backButtonContainer}
            >
                <BackArrow style={styles.backButton} />
            </TouchableOpacity>

            <View style={styles.headerContent}>
                {
                    status === 'loading' ? <ActivityIndicator
                        size={'small'} color={'white'} style={{ marginBottom: 10, }} /> :
                        <>
                            <Text style={styles.amount}>{amount}</Text>
                        </>
                }
                <Text style={styles.balanceText}>{t('totalBalance')}</Text>
                <TouchableOpacity
                    onPress={onWithdraw}
                    style={styles.withdrawButton}
                >
                    <Text style={styles.buttonText}>{t('withdraw')}</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: 250,
    },
    backButtonContainer: {
        position: 'absolute',
        top: heightPercentageToDP('6%'),
        left: 20,
    },
    backButton: {
        width: 20,
        height: 20,
        color: '#FFFFFF',
    },
    headerContent: {
        marginTop: heightPercentageToDP('10%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    amount: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 28,
        color: '#FFFFFF',
        marginBottom: 10,
    },
    balanceText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 15,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    withdrawButton: {
        width: 162,
        height: 42,
        backgroundColor: 'white',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 15,
        color: colors.primaryColor,
    },
});

export default MyWalletHeader;
