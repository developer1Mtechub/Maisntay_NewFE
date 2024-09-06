import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, Dimensions, FlatList, SafeAreaView } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import BadgeComponent from '../Components/BadgeComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import { BottomSheet } from "@rneui/themed";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomButton from '../../../components/ButtonComponent';
import HorizontalDivider from '../../../components/DividerLine';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoacheeWellcoins } from '../../../redux/CoacheeSlices/getWellcoinsSlice';
import { resetNavigation } from '../../../utilities/resetNavigation';
import useBackHandler from '../../../components/useBackHandler';
import { fetchCoacheeBadges } from '../../../redux/CoacheeSlices/getCoacheeBadgesSlice';
import { coacheeBadges } from '../../../utilities/badgesContent';
import useCustomTranslation from '../../../utilities/useCustomTranslation';

const CoacheeBadgesScreen = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const [badgeSheetVisible, setBadgeSheetVisible] = useState(false);
    const { response, error } = useSelector((state) => state.fetchCoacheeBadges)
    const BADGE_IMG = require('../../../assets/images/main_stays_badge_img.png')
    const [wellcoins, setWellcoins] = useState(0);
    const [badgeContent, setBadgeContent] = useState({
        tintColor: '#CD7F32',
        text: ''
    });
    const badgeTintColors = {
        gold: '#FFD700',
        platinum: '#E5E4E2',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
    };

    const badgeRequirements = {
        Bronze: 30,
        Silver: 60,
        Gold: 100,
        Platinum: 300
    };

    useEffect(() => {
        dispatch(fetchCoacheeBadges());
        dispatch(fetchCoacheeWellcoins({ limit: 0 })).then((result) => {
            setWellcoins(result?.payload?.overallTotalCoins)
        });
    }, [dispatch])



    const handleBadgePress = (badgeName) => {
        const requiredWellcoins = badgeRequirements[badgeName];
        const badgeInfo = {
            tintColor: wellcoins >= requiredWellcoins ? badgeTintColors[badgeName.toLowerCase()] : '#9A9A9A',
            text: wellcoins >= requiredWellcoins ? `${t('coacheeModalMsg1')} ${badgeName} ${t('coacheeModalMsg2')}` : `${t('coacheeModalMsg3')} ${requiredWellcoins} ${t('coacheeModalMsg4')} ${badgeName} ${t('coacheeModalMsg5')}`
        };

        setBadgeContent(badgeInfo);
        setBadgeSheetVisible(true);
    };

    const renderBadgeSheet = () => {
        return (
            <BottomSheet
                onBackdropPress={() =>
                    setBadgeSheetVisible(false)

                }
                modalProps={{}} isVisible={badgeSheetVisible}>
                <View
                    style={styles.sheetContainer}>
                    <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            tintColor={badgeContent.tintColor}
                            source={BADGE_IMG}
                            style={styles.badgeImage} />
                        <Text style={styles.badgeTitle}>{t('coacheeBadgeAlertTitle')}</Text>

                        <Text style={styles.badgeText}>{badgeContent.text}</Text>

                        <CustomButton
                            onPress={() => { setBadgeSheetVisible(false) }}
                            title={t('close')}
                            customStyle={{ marginTop: 30, marginBottom: 10 }}
                        />
                    </View>
                </View>
            </BottomSheet>
        );
    };

    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: "Setting" })
        return true;
    };
    useBackHandler(handleBackPress);

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                headerTitle={t('mainstaysBadges')}
                navigation={navigation}
                navigateTo={'Dashboard'}
                params={{ screen: 'Setting' }}
                customContainerStyle={{ marginStart: 30 }}
                customTextStyle={{ marginStart: 20 }}
            />
            {/* <Text style={styles.headingTextStyle}>
                Main Stays Badges
            </Text> */}

            <View style={styles.badgeContainer}>
                {coacheeBadges.map((badge, index) => {
                    const badgeColor = badgeTintColors[response?.result?.name?.toLowerCase()];

                    const activeInactiveBadge = response?.result?.name === badge.requiredBadge ? badgeColor : "#9A9A9A"


                    return (
                        <BadgeComponent
                            key={index}
                            onPress={() => handleBadgePress(badge.requiredBadge)}
                            badgeName={badge.requiredBadge}
                            badgeReviewText={`${badge.criteria}`}
                            customStyle={{ borderColor: activeInactiveBadge }}
                            imageTintColor={activeInactiveBadge}
                            customNameStyle={{ color: activeInactiveBadge }}
                            customTextStyle={{ color: activeInactiveBadge }}
                        />
                    );
                })}
            </View>

            <HorizontalDivider
                height={1}
                customStyle={{
                    width: wp('80%'),
                    alignSelf: 'center',
                    marginTop: 30
                }} />

            <Text style={styles.textStyle}>
                {t('coacheeBadgeDesc')}
            </Text>

            {renderBadgeSheet()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    headingTextStyle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 20,
        color: colors.primaryColor,
        alignSelf: 'center',
        marginTop: 50
    },
    badgeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // Use space-evenly for two badges in a row
        flexWrap: 'wrap', // Allow badges to wrap to the next line
        marginTop: hp('10%')
    },
    badgeImage: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    textStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 17,
        color: 'rgba(49, 40, 2, 0.7)',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 40
    },
    badgeText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 17,
        color: 'rgba(49, 40, 2, 0.7)',
        marginTop: 17,
        textAlign: 'center'
    },
    badgeTitle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 25,
        color: colors.primaryColor,
        marginTop: 20
    },
    sheetContainer:{
        backgroundColor: "#fff",
        width: '100%',
        //height: hp('40%'),
        borderTopEndRadius: 40,
        borderTopStartRadius: 40,
        padding: 10,
    }
});

export default CoacheeBadgesScreen;
