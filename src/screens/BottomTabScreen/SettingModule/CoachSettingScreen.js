import React, { Component, useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, Image,
    ScrollView, TouchableOpacity, ActivityIndicator, Share,
    Modal
} from 'react-native';
import colors from '../../../theme/colors';
import BadgeIcon from '../../../assets/svgs/coach_badge.svg'
import fonts from '../../../theme/fonts';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ForwardIcon from '../../../assets/svgs/forward_icon.svg'
import HorizontalDivider from '../../../components/DividerLine';
import CustomTextComponent from '../../../components/CustomTextComponent';
import EditProfileIcon from '../../../assets/svgs/edit_profile_icon.svg'
import ChangePassIcon from '../../../assets/svgs/pass_change_icon.svg'
import NotificationIcon from '../../../assets/svgs/noti_profile_icon.svg'
import ShareIcon from '../../../assets/svgs/share_icon.svg'
import TermIcon from '../../../assets/svgs/terms_cond_icon.svg'
import RateIcon from '../../../assets/svgs/rate_app_icon.svg'
import InterestIcon from '../../../assets/svgs/interset_icon.svg'
import CustomButton from '../../../components/ButtonComponent';
import LogoutIcon from '../../../assets/svgs/logout_icon.svg'
import { resetNavigation } from '../../../utilities/resetNavigation';
import InAppReview from 'react-native-in-app-review';
import { getData } from '../../../utilities/localStorage';
import { resetState } from '../../../redux/authSlices/userLoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeData } from '../../../utilities/localStorage';
import { fetchUserProfile } from '../../../redux/authSlices/getUserProfileSlice';
import FullScreenLoader from '../../../components/CustomLoader';
import DeleteAccountIcon from '../../../assets/svgs/delete_account_icon.svg'
import MyWalletIcon from '../../../assets/svgs/my_wallet_icon.svg'
import TurnoverIcon from '../../../assets/svgs/my_turnover_icon.svg'
import ReviewIcon from '../../../assets/svgs/my_review_icon.svg'
import { setUserId } from '../../../redux/setAnyTypeDataSlice';
import { fetchCoachBadge } from '../../../redux/coachSlices/getCoachBadgeSlice';
import LogoutBottomSheet from './LogoutBottomSheet';
import useCustomTranslation from '../../../utilities/useCustomTranslation';
import Icon from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import getCurrentLanguage from '../../../utilities/currentLanguage';


const CoachSettingScreen = ({ navigation }) => {
    const { t, changeLanguage } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.getUserProfile)
    const { response, error } = useSelector((state) => state.coachBadgeDetail)
    const [userInfo, setUserInfo] = useState({})
    const [isSheetVisible, setIsSheetVisible] = useState(false)
    const { user_id } = useSelector((state) => state.anyData);
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const BADGE_IMG = require('../../../assets/images/main_stays_badge_img.png')

    const toggleOverlay = () => {
        setVisible(!visible);
    };


    const badgeTintColors = {
        gold: '#FFD700',
        platinum: '#E5E4E2',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
    };

    const handleLogout = () => {
        logOutUser();
        setIsSheetVisible(false);
    };


    const handleLoadEnd = () => {
        setIsLoading(false);
    }

    const shareApp = async () => {
        try {
            const result = await Share.share({
                message: 'Check out this awesome app!',
                url: 'https://your-app-url.com', // Replace with your app's URL
                title: 'MainStays',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared via activity type
                    console.log(`Shared via ${result.activityType}`);
                } else {
                    // Shared
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing:', error.message);
        }
    };

    const reviewApp = () => {

        // This package is only available on android version >= 21 and iOS >= 10.3

        // Give you result if version of device supported to rate app or not!
        InAppReview.isAvailable();

        // trigger UI InAppreview
        InAppReview.RequestInAppReview()
            .then((hasFlowFinishedSuccessfully) => {
                // when return true in android it means user finished or close review flow
                console.log('InAppReview in android', hasFlowFinishedSuccessfully);

                // when return true in ios it means review flow lanuched to user.
                console.log(
                    'InAppReview in ios has launched successfully',
                    hasFlowFinishedSuccessfully,
                );

                // 1- you have option to do something ex: (navigate Home page) (in android).
                // 2- you have option to do something,
                // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

                // 3- another option:
                if (hasFlowFinishedSuccessfully) {
                    // do something for ios
                    // do something for android
                }

                // for android:
                // The flow has finished. The API does not indicate whether the user
                // reviewed or not, or even whether the review dialog was shown. Thus, no
                // matter the result, we continue our app flow.

                // for ios
                // the flow lanuched successfully, The API does not indicate whether the user
                // reviewed or not, or he/she closed flow yet as android, Thus, no
                // matter the result, we continue our app flow.
            })
            .catch((error) => {
                //we continue our app flow.
                // we have some error could happen while lanuching InAppReview,
                // Check table for errors and code number that can return in catch.
                console.log(error);
            });
    }

    useEffect(() => {
        const getUserData = async () => {
            const userData = await getData('userData');
            // console.log('userData', userData.user.id)
            dispatch(fetchCoachBadge({ user_id: userData?.user?.id ? userData?.user?.id : user_id }))
            dispatch(fetchUserProfile({
                user_id: userData?.user?.id ? userData?.user?.id : user_id,
                role: userData?.user?.role
            })).then((result) => {
                if (result?.payload?.success === true) {
                    setUserInfo(result?.payload)
                }

            })
        }
        getUserData();
    }, [dispatch, user_id])

    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }


    // function getProfilePicUri(userInfo) {
    //     return userInfo?.user?.details?.profile_pic != null || userInfo?.user?.profile_pic ?
    //         { uri: userInfo?.user?.details?.profile_pic || userInfo?.user?.profile_pic } :
    //         require('../../../assets/images/user_profile_dummy.png');
    // }

    function getProfilePicUri(userInfo) {
        return { uri: userInfo?.user?.details?.profile_pic || userInfo?.user?.profile_pic }
    }

    const logOutUser = async () => {
        dispatch(resetState({ token: null }));
        try {
            await removeData("token");
            await removeData('userData');
        } catch (error) {
            console.log(error);
        }
    };

    const handleUserId = (screen) => {
        dispatch(setUserId({ user_id: userInfo?.user?.id }))
        resetNavigation(navigation, screen)
    }

    const renderLanguageOverlay = () => {
        return <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={toggleOverlay}
        >
            <View style={styles.centeredView}>

                <View style={styles.modalView}>


                    <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={() => {
                            toggleOverlay()
                        }} // Call function to close modal
                    >
                        <AntDesign name="closecircle" size={24} color="red" />
                    </TouchableOpacity>

                    <Text style={styles.modalText}>{t('changeLanguage')}</Text>
                    <TouchableOpacity
                        style={styles.buttonModal}
                        onPress={() => {
                            changeLanguage('en')
                            toggleOverlay()
                        }}
                    >
                        <Text style={styles.buttonTextModal}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonModal}
                        onPress={() => {
                            changeLanguage('de')
                            toggleOverlay()
                        }}
                    >
                        <Text style={styles.buttonTextModal}>German</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    }

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.headerStyle}>{t('settings')}</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginStart: 20 }}>
                <View style={styles.conatinerProfile}>

                    <TouchableOpacity
                        onPress={() => { handleUserId("CoachSettingProfile") }}
                        style={styles.profileContainer}>
                        <Image
                            resizeMode='cover'
                            source={getProfilePicUri(userInfo)}
                            style={[styles.profileImage]}
                            onLoadEnd={handleLoadEnd}
                        />

                        {/* <BadgeIcon style={styles.badge} /> */}
                        {response?.result?.name && response?.result?.name !== 'NULL' &&
                            response?.result?.name != 'null' && <Image
                                style={{
                                    width: 28,
                                    height: 28,
                                    // alignSelf: 'center',
                                    // marginStart: 20,
                                    position: 'absolute',
                                    bottom: -6,
                                    right: 4,
                                    tintColor: badgeTintColors[response?.result?.name?.toLowerCase()]
                                }}
                                source={BADGE_IMG} />


                        }
                        {isLoading && <ActivityIndicator
                            style={styles.loader}
                            size="large"
                            color={colors.primaryColor} />}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { handleUserId("CoachSettingProfile") }}>
                        <Text style={styles.title}>
                            {`${userInfo?.user?.first_name} ${userInfo?.user?.last_name}`}
                        </Text>
                    </TouchableOpacity>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        style={{ flexDirection: 'row', marginEnd: 20 }}>

                        {
                            (userInfo?.user?.details?.coaching_areas ||
                                userInfo?.user?.coaching_areas)?.map((item, index) => {
                                    return <Text
                                        key={index}
                                        style={[styles.rateStyle,
                                        {
                                            marginStart: 0,
                                            marginTop: 5
                                        }]}>
                                        {currentLanguage === "de" ? item?.german_name : item?.name}
                                        {index !== (userInfo?.user?.details?.coaching_areas ||
                                            userInfo?.user?.coaching_areas)?.length - 1 ? ', ' : ''}
                                    </Text>
                                })
                        }

                    </ScrollView>

                </View>
                <TouchableOpacity
                    onPress={() => {
                        resetNavigation(navigation, "BadgesScreen")
                    }}
                    style={styles.badgeContainer}>

                    {response?.result?.name && response?.result?.name !== 'NULL' && <Image
                        style={{
                            width: 42,
                            height: 42,
                            alignSelf: 'center',
                            marginStart: 20,
                            tintColor: badgeTintColors[response?.result?.name?.toLowerCase()]
                        }}
                        source={BADGE_IMG} />

                    }
                    <View style={styles.badgeHeaderContainer}>
                        <Text style={[styles.badgeTextStyle, !response?.result?.name && { alignSelf: 'center' }]}>{response?.result?.name && response?.result?.name !== 'NULL' ? `${response?.result?.name} Badge` : t('badgeNotAvailable')}</Text>

                        {(
                            response?.resultRating?.total_ratings != undefined &&
                            response?.resultRating?.average_rating &&
                            <Text style={styles.coinsTextStyle}>
                                {`${response?.resultRating?.total_ratings} Reviews (${response?.resultRating?.four_star_ratings}, ${Math.round(response?.resultRating?.average_rating)} ${t('starReviews')})`}
                            </Text>
                        )}
                    </View>

                    <ForwardIcon
                        onPress={() => {
                            resetNavigation(navigation, "BadgesScreen")
                        }}
                        style={{
                            alignSelf: 'center',
                            right:20
                        }} />

                </TouchableOpacity>

                <HorizontalDivider
                    height={1}
                    customStyle={{
                        marginTop: 20, width: wp('90%'),
                        // alignSelf: 'center'
                    }} />



                <CustomTextComponent
                    text={t('myWallet')}
                    icon={<MyWalletIcon />}
                    onPress={() => {
                        handleUserId("MyWallet")
                    }}
                />

                <CustomTextComponent
                    text={t('myTurnOvers')}
                    icon={<TurnoverIcon />}
                    onPress={() => {
                        handleUserId("Turnovers")
                    }}
                />

                <CustomTextComponent
                    text={t('myReviews')}
                    icon={<ReviewIcon />}
                    onPress={() => {
                        //resetNavigation(navigation, 'MyReviews')
                        handleUserId("MyReviews")
                    }}
                />

                <CustomTextComponent
                    text={t('editProfile')}
                    icon={<EditProfileIcon />}
                    onPress={() => {
                        resetNavigation(navigation, "EditCoachProfile")
                    }}
                />

                <CustomTextComponent
                    text={t('changePassword')}
                    icon={<ChangePassIcon />}
                    onPress={() => {
                        resetNavigation(navigation, "ChangePassword", { email: null })
                    }}
                />

                {/* <CustomTextComponent
                    text="Notification Settings"
                    icon={<NotificationIcon />}
                    onPress={() => {
                        resetNavigation(navigation, 'NotificationSetting')
                    }}
                /> */}

                {/* <CustomTextComponent
                    text="Share App"
                    icon={<ShareIcon />}
                    onPress={async () => { shareApp() }}
                />

                <CustomTextComponent
                    text="Rate App"
                    icon={<RateIcon />}
                    onPress={() => { reviewApp() }}
                /> */}

                <CustomTextComponent
                    text={t('changeLanguage')}
                    icon={<Icon name={'language'} size={24} color={colors.primaryColor} />}
                    onPress={() => {
                        toggleOverlay();
                    }}
                />

                <CustomTextComponent
                    text={t('privacyPolicy')}
                    icon={<ChangePassIcon />}
                    onPress={() => { resetNavigation(navigation, "Terms&PrivacyPolicy", { type: "privacy" }) }}
                />

                <CustomTextComponent
                    text={t('terms&Conditions')}
                    icon={<TermIcon />}
                    onPress={() => { resetNavigation(navigation, "Terms&PrivacyPolicy", { type: "terms" }) }}
                />

                <CustomTextComponent
                    text={t('deleteAccount')}
                    icon={<DeleteAccountIcon />}
                    onPress={() => {
                        resetNavigation(navigation, "DeleteAccount")
                    }}
                />

                <View style={styles.buttonStyle}>
                    <TouchableOpacity style={[styles.button]}
                        onPress={() => {
                            setIsSheetVisible(true)
                        }}>
                        {false ? <ActivityIndicator size="small" color="#ffffff" /> :
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <LogoutIcon style={{ marginRight: 10, alignSelf: 'center' }} />
                                <Text style={[styles.buttonText]}>{t('logout')}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <LogoutBottomSheet
                isVisible={isSheetVisible}
                onClose={() => setIsSheetVisible(false)}
                onLogoutPress={() => { handleLogout() }}
            />

            {renderLanguageOverlay()}

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    profileContainer: {
        position: 'relative',
        backgroundColor: '#F6F6F6',
        width: 75,
        height: 75,
        borderRadius: 35,
        justifyContent: 'center'
    },
    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 35,
        alignSelf: 'center',
    },
    badge: {
        position: 'absolute',
        bottom: -8,
        right: 0,
    },
    title: {
        fontSize: 17,
        fontFamily: fonts.fontsType.bold,
        color: colors.primaryColor,
        marginTop: 15
    },
    rateStyle: {
        fontSize: 13,
        fontFamily: fonts.fontsType.medium,
        color: colors.blackTransparent,

    },
    headerStyle: {
        color: '#312802',
        fontSize: 23,
        fontFamily: fonts.fontsType.semiBold,
        lineHeight: 47,
        alignSelf: 'center'
    },
    conatinerProfile: {
        alignItems: 'center',
        marginTop: hp('3%')
    },
    badgeHeaderContainer: {
        alignSelf: 'center',
        marginStart: 8,
        marginTop: 5,
       marginEnd:10,
       flex:1
    },
    badgeTextStyle: {
        fontFamily: fonts.fontsType.bold,
        color: colors.white,
        fontSize: 17,
        lineHeight: 27,
    },

    coinsTextStyle: {
        fontFamily: fonts.fontsType.medium,
        color: colors.white,
        fontSize: 13,
        top:5,

    },
    badgeContainer: {
        width: '95%',
        height: 70,
        backgroundColor: colors.primaryColor,
        //alignSelf: 'center',
        borderRadius: 14,
        marginTop: 15,
        flexDirection: 'row'
    },
    button: {
        backgroundColor: 'rgba(15, 109, 106, 1)',
        borderRadius: 30,
        width: '95%',
        height: 45,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    buttonText: {
        color: 'rgba(255, 255, 255, 1)',
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 16,
        textAlign: 'center',
    },
    buttonStyle: { marginTop: 20 },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -18, // Adjust based on loader size
        marginTop: -16, // Adjust based on loader size
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 35,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        color: colors.blackTransparent,
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 16,
        textAlign: 'center',
    },

    buttonModal: {
        backgroundColor: 'rgba(15, 109, 106, 1)',
        borderRadius: 30,
        width: '95%',
        height: 35,
        justifyContent: 'center',
        marginTop: 20,

    },
    buttonTextModal: {
        color: 'rgba(255, 255, 255, 1)',
        fontFamily: fonts.fontsType.medium,
        fontSize: 14,
        textAlign: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: -1,
        right: -2,
    },
});


export default CoachSettingScreen;
