//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import BadgeIcon from '../../assets/svgs/coach_badge.svg'
import RateStar from '../../assets/svgs/rate_star_icon.svg'
import fonts from '../../theme/fonts';
import { Rating, AirbnbRating } from 'react-native-ratings';
import CustomInput from '../../components/TextInputComponent';
import CustomButton from '../../components/ButtonComponent';
import CustomLayout from '../../components/CustomLayout';
import { useDispatch, useSelector } from 'react-redux';
import { rateTheCoach } from '../../redux/CoacheeSlices/ratetheCoachSlice';
import { BottomSheet } from '@rneui/themed';
import RateSuccessIcon from '../../assets/svgs/rate_success.svg'
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { resetNavigation } from '../../utilities/resetNavigation';
import CustomSnackbar from '../../components/CustomToast';
import useBackHandler from '../../components/useBackHandler';
import { createNotification } from '../../redux/NotificationModuleSlices/createNotificationSlice';
import { fetchRatingBySession } from '../../redux/CoacheeSlices/getRatingBySessionSlice';
import { fetchSessionDetailById } from '../../redux/Sessions/getSessionByIdSlice';
import FullScreenLoader from '../../components/CustomLoader';
import { setCategoryId } from '../../redux/DashboardSlices/setCategoryIdSlice';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import useCustomTranslation from '../../utilities/useCustomTranslation';

const RateTheCoach = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.rateTheCoach)
    const sessionStatus = useSelector((state) => state.sessionDetailById.status)
    const { user_id } = useSelector((state) => state.userLogin)
    const { sessionId } = useSelector((state) => state.setSessionId)
    const { response } = useSelector((state) => state.ratingBySession)
    const [rateMessage, SetRateMessage] = useState('');
    const [selectedRate, setSelectedRate] = useState(0);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [coachDetail, setCoachDetails] = useState({});
    const [loading, setLoading] = useState(true)
    const BADGE_IMG = require('../../assets/images/main_stays_badge_img.png')
    const badgeTintColors = {
        gold: '#FFD700',
        platinum: '#E5E4E2',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
    };

    const handleBackPress = () => {
        if (sessionId?.route === 'NotificationList') {
            resetNavigation(navigation, 'NotificationList')
        } else {
            resetNavigation(navigation, 'CoachingDetail', {
                upcomingStatus: 'completed',
                session_id: coachDetail?.session_id
            })
        }

        return true;
    };

    useBackHandler(handleBackPress)

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                await dispatch(fetchRatingBySession({ session_id: sessionId?.session_id }));
                const result = await dispatch(fetchSessionDetailById({ sessionId: sessionId?.session_id }));
                if (result?.payload?.success == true) {

                    const { session } = result?.payload;
                    const first_name = session?.session_data?.coach?.name?.split(' ')[0];
                    const last_name = session?.session_data?.coach?.name?.split(' ')[1];
                    const payload = {
                        area_name: session?.session_data?.coaching_area_name,
                        coach_id: session?.session_data?.coach?.coach_id,
                        comment: response?.result?.comment || undefined,
                        first_name,
                        last_name,
                        profile_pic: session?.session_data?.coach?.profile_pic,
                        rate: session?.session_data?.coach?.coach_avg_rating,
                        rating: response?.result?.rating || undefined,
                        session_id: sessionId?.session_id,
                        coach_badge: session?.session_data?.coach?.coach_badge
                    };

                    setCoachDetails(payload);
                    await Promise.all([result]);
                }
            } catch (error) {
                console.error("Failed to fetch session details", error);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId?.session_id) {
            fetchDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, sessionId]);


    const isCommentAvailable = coachDetail?.comment !== undefined && coachDetail?.comment !== null;
    const isRatingAvailable = coachDetail?.rating !== undefined && coachDetail?.rating !== null;

    // Update header title and button text accordingly
    const headerTitle = isCommentAvailable && isRatingAvailable ? t('headerTitleUpdate') : t('headerTitleGive');
    const buttonText = isCommentAvailable && isRatingAvailable ? t('headerTitleUpdate') : t('buttonTextSubmit');


    useEffect(() => {
        if (isCommentAvailable) {
            SetRateMessage(coachDetail?.comment);
            setSelectedRate(coachDetail?.rating || 0);
        } else {
            SetRateMessage('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCommentAvailable, coachDetail.comment, isRatingAvailable]);

    const handleRateSubmit = () => {

        const payload = {
            sessionsId: coachDetail?.session_id,
            coachId: coachDetail?.coach_id,
            rating: selectedRate,
            comment: rateMessage
        }

        const notificationPayload = {
            title: "SESSION_REVIEW",
            content: "You got a new review",
            type: "REVIEWS", // SESSION | BADGES | PAYMENT | REVIEWS
            coach_id: coachDetail?.coach_id,
            coachee_id: user_id,
            session_id: coachDetail?.session_id
        }

        dispatch(rateTheCoach(payload)).then((result) => {
            if (result?.payload?.success === true) {
                dispatch(createNotification(notificationPayload)).then((result) => {
                    //console.log('create notification', result?.payload?.success)
                })
                setIsSheetVisible(true)
            } else {
                renderErrorMessage(result?.payload?.message)
            }
        })

    }


    const renderSuccessMessage = (message) => {
        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')

        setTimeout(() => {
            resetNavigation(navigation, 'CoachingList')
        }, 3000);

    }

    const renderErrorMessage = (message) => {
        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }

    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }

    if (loading) {
        return <FullScreenLoader visible={loading ? 'loading' : 'noting'} />
    }

    const handleNavigation = (categoryId, screenName) => {
        dispatch(setCategoryId(categoryId))
        dispatch(setSessionId({
            route: 'Dashboard'
        }))
        resetNavigation(navigation, screenName)
    }

    const renderSuccessBottomSheet = () => {
        return <BottomSheet
            onBackdropPress={() => {
                setIsSheetVisible(false)
                resetNavigation(navigation, "Dashboard")
            }
            }
            modalProps={{}} isVisible={isSheetVisible}>
            <View
                style={styles.sheetContainer}
            >
                <RateSuccessIcon style={{ alignSelf: 'center' }} />

                <Text style={styles.titleSheet}>{t('successMessageDescription')}</Text>


                <Text style={styles.subTitle}>
                    {t('ratingThankYouText')}
                </Text>
                <CustomButton
                    onPress={() => {
                        handleNavigation(coachDetail?.coach_id, "CoachDetail")
                        setIsSheetVisible(false)
                    }}
                    title={t('bookNewSessionText')}
                    customStyle={{ width: '100%', top: 10, marginBottom: 20 }}
                />
                <CustomButton
                    onPress={() => {
                        setIsSheetVisible(false)
                        resetNavigation(navigation, "Dashboard")
                    }}
                    title={t('goToHomeText')}
                    customStyle={styles.btnCustom}
                    textCustomStyle={styles.customText}
                />
            </View>
        </BottomSheet>
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ margin: 20, }}>
                <HeaderComponent
                    headerTitle={headerTitle}
                    navigation={navigation}
                    navigateTo={sessionId?.route}
                    params={{
                        upcomingStatus: 'completed',
                        session_id: coachDetail?.session_id
                    }}
                />
            </View>
            {renderToastMessage()}
            <CustomLayout>
                <View style={{ margin: 20, }}>

                    <View style={styles.container2}>

                        <View style={styles.profileContainer}>
                            <Image
                                resizeMode='cover'
                                source={{ uri: coachDetail?.profile_pic || 'https://via.placeholder.com/150?text=' }} // Replace with actual image URI
                                style={[styles.profileImage]}
                            />
                            {/* {<BadgeIcon width={20} height={20} style={styles.badge} />} */}
                            {coachDetail?.coach_badge && < Image
                                style={{
                                    width: 20,
                                    height: 20,
                                    position: 'absolute',
                                    bottom: -4,
                                    right: 5,
                                    tintColor: badgeTintColors[coachDetail?.coach_badge?.toLowerCase()]
                                }}
                                source={BADGE_IMG} />}
                        </View>

                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={[styles.title,]}>{`${coachDetail?.first_name} ${coachDetail?.last_name !== undefined ? coachDetail?.last_name : ''}`}</Text>
                        <RateStar width={18} height={18} style={{ alignSelf: 'center', marginStart: 5 }} />
                        <Text style={styles.rateStyle}>{`${parseInt(coachDetail?.rate)?.toFixed(1) !== 'NaN' ?
                            parseInt(coachDetail?.rate)?.toFixed(1) : 0}`}</Text>
                        {/* <Text style={styles.rateStyle}>{`${parseInt(coachDetail?.rating)?.toFixed(1) !== 'NaN' ?
                            parseInt(coachDetail?.rating)?.toFixed(1) : 0}`}</Text> */}
                        {/* <Text style={styles.rateStyle}>{`${Math.floor(coachDetail?.rating)}`}</Text> */}
                    </View>
                    <Text style={[styles.areaStyle,]}>{coachDetail?.area_name}</Text>
                    <View>
                        {/* <Rating
                            //showRating
                            ratingCount={5}
                            imageSize={35}
                            startingValue={coachDetail?.rating ? coachDetail?.rating : 0}
                            minValue={0}
                            onFinishRating={(result) => {
                                //console.log(result)
                                setSelectedRate(result)
                            }}
                            style={{ marginTop: 40, justifyContent: 'space-between' }}
                        /> */}

                        <AirbnbRating
                            onFinishRating={(result) => {
                                console.log(result)
                                setSelectedRate(result)
                            }}
                            showRating={false}
                            count={5}
                            selectedColor='rgba(255, 227, 78, 1)'
                            unSelectedColor='rgba(199, 199, 199, 1)'
                            defaultRating={coachDetail?.rating ? coachDetail?.rating : 0}
                            size={30}
                            starContainerStyle={{
                                justifyContent: 'space-between',
                                marginTop: 40,
                            }}
                        />

                        <Text style={{
                            fontFamily: fonts.fontsType.medium,
                            position: 'absolute',
                            top: '38%',
                            right: 8,
                            color: colors.primaryColor,
                            fontSize: 12,
                        }}>
                            {`${rateMessage?.length}/250`}
                        </Text>

                        <CustomInput
                            identifier={'message'}
                            value={rateMessage}
                            placeholder={t('writeMessagePlaceholder')}
                            multiline={true}
                            customContainerStyle={{ marginTop: 50, }}
                            onValueChange={(text) => { SetRateMessage(text) }}
                        />



                    </View>



                    <CustomButton
                        loading={status === 'loading' ? true : false}
                        onPress={() => {
                            handleRateSubmit()
                        }}
                        title={buttonText}
                        customStyle={{ marginTop: '40%' }}
                    />

                </View>
            </CustomLayout>
            {renderSuccessBottomSheet()}
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
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    badge: {
        position: 'absolute',
        //bottom: -8,
        bottom: -1,
        right: 2,
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //marginTop: 50,
        marginTop: 10
    },
    title: {
        fontSize: 16,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.primaryColor,
        alignSelf: 'center'
    },
    rateStyle: {
        fontSize: 14,
        fontFamily: fonts.fontsType.medium,
        color: colors.blackTransparent,
        marginStart: 5,
        alignSelf: 'center'
    },
    areaStyle: {
        fontSize: 15,
        fontFamily: fonts.fontsType.regular,
        color: colors.blackTransparent,
        alignSelf: 'center'
    },
    sheetContainer: {
        backgroundColor: 'white',
        width: "100%",
        borderTopEndRadius: 40,
        borderTopStartRadius: 40,
        padding: 25,
        height: heightPercentageToDP('45%')
    },
    titleSheet: {
        fontSize: 20,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.primaryColor,
        alignSelf: 'center',
        marginTop: 30
    },
    subTitle: {
        fontSize: 16,
        fontFamily: fonts.fontsType.medium,
        color: 'rgba(49, 40, 2, 1)',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10
    },
    btnCustom: {
        width: '100%',
        backgroundColor: colors.transparent,
        marginTop: 5,
        marginBottom: 5
    },
    customText: { color: colors.primaryColor, fontFamily: fonts.fontsType.semiBold }
});

export default RateTheCoach;
