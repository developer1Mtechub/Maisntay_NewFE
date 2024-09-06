import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, Dimensions, FlatList, SafeAreaView } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import BadgeComponent from '../Components/BadgeComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import { BottomSheet } from "@rneui/themed";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomButton from '../../../components/ButtonComponent';
import { fetchCoachBadge } from '../../../redux/coachSlices/getCoachBadgeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../../../utilities/localStorage';
import { resetNavigation } from '../../../utilities/resetNavigation';
import useBackHandler from '../../../components/useBackHandler';
import { coachBadges } from '../../../utilities/badgesContent';
import useCustomTranslation from '../../../utilities/useCustomTranslation';

const BadgesScreen = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const BADGE_IMG = require('../../../assets/images/main_stays_badge_img.png')
    const [badgeSheetVisible, setBadgeSheetVisible] = useState(false);
    const { response, error } = useSelector((state) => state.coachBadgeDetail)
    const { user_id } = useSelector((state) => state.anyData);
    const [badgeContent, setBadgeContent] = useState({
        tintColor: '#CD7F32',
        text: t('badgeGoldCountdown')
    });
    const [userReviews, setUserReviews] = useState(0); // Sample user reviews, change this to actual user review count
    const [userRating, setUserRating] = useState(0); // Sample user rating, change this to actual user rating

    const badgeTintColors = {
        gold: '#FFD700',
        platinum: '#E5E4E2',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        inactiveColor: '#9A9A9A'
    };

    useEffect(() => {
        const getUserData = async () => {
            const userData = await getData('userData');
            if (userData) {
                const userId = userData?.user?.id;
                dispatch(fetchCoachBadge({ user_id: userId })).then((result) => {
                    //console.log('badge;;;;', result?.payload)
                    const { total_ratings, four_star_ratings } = result?.payload?.resultRating;
                    setUserReviews(total_ratings);
                    setUserRating(four_star_ratings);
                });
            } else {
                console.log('No id found for badge')
                // Handle the case where userData or userData.id is undefined
            }
        };
        getUserData();
    }, [dispatch, user_id]);


    const handleBadgePress = (badgeName) => {
        let newBadgeContent = {};

        switch (badgeName) {
            case 'Bronze':
                if (userReviews >= 5 && userRating >= 4) {
                    newBadgeContent = {
                        tintColor: badgeTintColors.bronze,
                        text: t('badgeBronzeAchieved')
                    };
                } else {
                    newBadgeContent = {
                        tintColor: badgeTintColors.inactiveColor,
                        text: t('badgeBronzeRequirement')
                    };
                }
                break;
            case 'Silver':
                if (userReviews >= 15 && userRating >= 4) {
                    newBadgeContent = {
                        tintColor: badgeTintColors.silver,
                        text: t('badgeSilverAchieved')
                    };
                } else {
                    newBadgeContent = {
                        tintColor: badgeTintColors.inactiveColor,
                        text: t('badgeSilverRequirement')
                    };
                }
                break;
            case 'Gold':
                if (userReviews >= 25 && userRating >= 4) {
                    newBadgeContent = {
                        tintColor: badgeTintColors.gold,
                        text: t('badgeGoldAchieved')
                    };
                } else {
                    newBadgeContent = {
                        tintColor: badgeTintColors.inactiveColor,
                        text: t('badgeGoldRequirement')
                    };
                }
                break;
            case 'Platinum':
                if (userReviews >= 50 && userRating >= 4) {
                    newBadgeContent = {
                        tintColor: badgeTintColors.platinum,
                        text: t('badgePlatinumAchieved')
                    };
                } else {
                    newBadgeContent = {
                        tintColor: badgeTintColors.inactiveColor,
                        text: t('badgePlatinumRequirement')
                    };
                }
                break;
            default:
                newBadgeContent = {
                    tintColor: badgeTintColors.inactiveColor,
                    text: t('badgeInfoUnavailable')
                };
        }

        setBadgeContent(newBadgeContent);
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
                    style={{
                        backgroundColor: 'white',
                        width: '100%',
                        //height: hp('40%'),
                        borderTopEndRadius: 40,
                        borderTopStartRadius: 40,
                        padding: 10,
                    }}>
                    <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            tintColor={badgeContent.tintColor}
                            source={BADGE_IMG}
                            style={styles.badgeImage} />
                        <Text style={{
                            fontFamily: fonts.fontsType.bold,
                            fontSize: 25,
                            color: colors.primaryColor,
                            marginTop: 20
                        }}>{t('coacheeBadgeAlertTitle')}</Text>

                        <Text style={{
                            fontFamily: fonts.fontsType.medium,
                            fontSize: 17,
                            color: 'rgba(49, 40, 2, 0.7)',
                            marginTop: 17,
                            textAlign: 'center'
                        }}>{badgeContent.text}</Text>

                        <CustomButton
                            onPress={() => { setBadgeSheetVisible(false) }}
                            title={t('close')}
                            customStyle={{ marginTop: 30, marginBottom:10 }}
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
                {coachBadges?.map((badge, index) => {
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

            {renderBadgeSheet()}

        </SafeAreaView>
    );
};

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
        marginTop: hp('10%'),
        marginHorizontal: -20,
    },
    badgeImage: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
});

export default BadgesScreen;
