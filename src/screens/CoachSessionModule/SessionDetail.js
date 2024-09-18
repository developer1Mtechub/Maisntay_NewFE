import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import ProfileCard from '../../components/ProfileCard';
import fonts from '../../theme/fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/ButtonComponent';
import { postSessionStatus } from '../../redux/coachSlices/sessionAcceptRejectSlice';
import moment from 'moment';
import BadgeIcon from '../../assets/svgs/coach_badge.svg'
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import { fetchSessionDetailById } from '../../redux/Sessions/getSessionByIdSlice';
import ChatIcon from '../../assets/svgs/session_chat_icon.svg'
import useBackHandler from '../../components/useBackHandler';
import { createNotification } from '../../redux/NotificationModuleSlices/createNotificationSlice';
import HorizontalDivider from '../../components/DividerLine';
import { Rating } from 'react-native-ratings';
import { fetchRatingBySession } from '../../redux/CoacheeSlices/getRatingBySessionSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import { setReceiverId } from '../../redux/setReceiverIdSlice';
import { useAlert } from '../../providers/AlertContext';


const SessionDetails = ({ navigation }) => {
    const { t } = useCustomTranslation()
    const dispatch = useDispatch();
    const { showAlert } = useAlert()
    const { status } = useSelector((state) => state.sessionAcceptORReject)
    const sessionStatus = useSelector((state) => state.sessionDetailById.status)
    const { sessionId } = useSelector((state) => state.setSessionId)
    const { response } = useSelector((state) => state.ratingBySession)
    const { role } = useSelector((state) => state.userLogin)
    const [sessionDetail, setSessionDetail] = useState({});

    const BADGE_IMG = require('../../assets/images/main_stays_badge_img.png')

    const badgeTintColors = {
        gold: '#FFD700',
        platinum: '#E5E4E2',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
    };


    const handleBackPress = () => {
        resetNavigation(navigation, sessionId?.route, { screen: 'MyCoaching' })
        return true;
    };

    useBackHandler(handleBackPress)

    useEffect(() => {
        dispatch(fetchRatingBySession({ session_id: sessionId?.session_id }));
        dispatch(fetchSessionDetailById({ sessionId: sessionId?.session_id })).then((result) => {
            if (result?.payload?.success === true) {

                setSessionDetail(result?.payload?.session?.session_data)
            }
        })
    }, [dispatch, sessionId])


    const handlePostSessionStatus = (sessionSatus) => {

        const sessionPayload = {
            status: sessionSatus,
            sessionId: sessionId?.session_id
        }
        dispatch(postSessionStatus(sessionPayload)).then((result) => {
            if (result?.payload?.success === true) {
                if (sessionSatus == 'accepted') {
                    dispatch(createNotification(
                        {
                            "title": "SESSION_ACCEPTED",
                            "content": "Your session has been accepted by coach.",
                            "type": "SESSION", // SESSION | BADGES | PAYMENT | REVIEWS
                            "coach_id": sessionDetail?.coach?.coach_id,
                            "coachee_id": sessionDetail?.coachee?.coachee_id,
                            "session_id": sessionId?.session_id
                        }
                    )).then((result) => {
                        console.log('create notification', result?.payload?.success)

                    })
                }
                showAlert("Success", "success", sessionSatus === 'accepted' ?
                    t('requestAcceptedMessage') : t('requestRejectedMessage'))

                    setTimeout(() => {
                        resetNavigation(navigation, 'CoachingList')
                    }, 3000);

            }
            else {
                showAlert("Error", "error",result?.payload?.message)
            }
        })
    }


    if (sessionStatus === 'loading') {
        return <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.primaryColor} size={'large'} />
        </View>
    }

    const getStatus = (status) => {
        if (status === 'pending') {
            return t('pending')
        }
        if (status === 'completed') {
            return t('completed')
        }

        if (status === 'accepted') {
            return t('accepted')
        }

        if (status === 'paid') {
            return t('upcoming')
        }

        if (status === 'rejected') {
            return t('rejected')
        }
    }

    const renderProfile = () => {
        return <View style={[styles.conatinerProfile]}>
            <View style={styles.profileContainer}>
                <Image
                    resizeMode='cover'
                    source={{
                        uri: sessionDetail?.coachee?.profile_pic || 'https://via.placeholder.com/150' // Placeholder image URL
                    }}
                    style={[styles.profileImage]}
                />
                {/* <BadgeIcon style={styles.badge} /> */}
                {sessionDetail?.coachee?.coachee_badge && sessionDetail?.coachee?.coachee_badge !== 'NULL' &&
                    sessionDetail?.coachee?.coachee_badge != 'null' && <Image
                        style={{
                            width: 20,
                            height: 20,
                            // alignSelf: 'center',
                            // marginStart: 20,
                            position: 'absolute',
                            bottom: -6,
                            right: 4,
                            tintColor: badgeTintColors[sessionDetail?.coachee?.coachee_badge?.toLowerCase()]
                        }}
                        source={BADGE_IMG} />


                }
            </View>
            <View style={{ marginStart: 15, flex: 1 }}>
                <Text style={styles.title}>{`${sessionDetail?.coachee?.name}`}</Text>

                {/* <Text style={styles.rateStyle}>{`${''}`}</Text> */}

                {sessionDetail?.session_details?.status && <Text
                    style={[styles.statusTitle,
                    {
                        fontSize: 13,
                        marginTop: 10,
                        color: sessionDetail?.session_details?.status === 'pending' ?
                            '#D88200' : sessionDetail?.session_details?.status === 'completed' ||
                                sessionDetail?.session_details?.status === 'accepted' ||
                                sessionDetail?.session_details?.status === 'paid' ?
                                '#00BB34' : sessionDetail?.session_details?.status === 'rejected' ? '#FF0000' : 'white',
                    }]}>
                    {getStatus(sessionDetail?.session_details?.status)}
                </Text>}
            </View>

            <ChatIcon width={50} height={50} onPress={() => {
                resetNavigation(navigation, 'ChatScreen')
            }} />

        </View>
    }




    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.secondContainer}>

                <HeaderComponent
                    headerTitle={t('sessionDetailsHeader')}
                    navigation={navigation}
                    navigateTo={sessionId?.route}
                    params={{ screen: 'MyCoaching' }}
                />

                {renderProfile()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{}}>

                    <View style={{ marginTop: 30 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent
                        }}>
                            {t('categoryLabel')}
                        </Text>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {sessionDetail?.coaching_area_name}
                        </Text>

                    </View>


                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent
                        }}>
                            {t('dateLabel')}
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {/* {moment(sessionDetail?.session_details?.date).format('ddd, MMM DD, YYYY')} */}
                            {moment(sessionDetail?.session_details?.date).format('DD-MM-yyyy')}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent
                        }}>
                            {t('timeLabel')}
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {sessionDetail?.session_details?.section}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent
                        }}>
                            {t('sessionTypeLabel')}
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {`${sessionDetail?.session_details?.duration} minutes (CHF ${sessionDetail?.session_details?.amount})`}
                        </Text>
                    </View>

                    {
                        sessionDetail?.session_details?.status === 'completed' &&
                        response?.result?.rating && response?.result?.comment && <View>

                            <HorizontalDivider customStyle={{ marginTop: 20 }} />

                            <Text style={{
                                fontSize: 16,
                                fontFamily: fonts.fontsType.semiBold,
                                lineHeight: 27,
                                color: colors.primaryColor,
                                marginTop: 30
                            }}>
                                {t('ratingLabel')}
                            </Text>

                            <View style={{ marginTop: 10 }}>

                                <Rating
                                    type='star'
                                    readonly={true}
                                    startingValue={response?.result?.rating}
                                    imageSize={25}
                                    minValue={0}
                                    ratingCount={5}
                                    style={{ marginLeft: '-66%' }}
                                />

                                <Text style={{
                                    fontFamily: fonts.fontsType.regular,
                                    fontSize: 14,
                                    color: colors.blackTransparent,
                                    marginTop: 15,
                                    width: '90%'
                                }}>
                                    {response?.result?.comment}
                                </Text>

                            </View>

                        </View>
                    }


                    {
                        sessionDetail?.session_details?.status === 'pending' &&
                        <View style={{ marginTop: hp('15%') }}>
                            <CustomButton
                                loading={status == 'loading' ? true : false}
                                onPress={() => {
                                    handlePostSessionStatus("accepted")
                                }}
                                title={t('requestAcceptedBtn')}
                                customStyle={{}} />

                            <CustomButton
                                loading={status == 'loading' ? true : false}
                                onPress={() => {
                                    handlePostSessionStatus("rejected")
                                }}
                                title={t('requestRejectedBtn')}
                                customStyle={{
                                    marginTop: hp('-3%'),
                                    backgroundColor: colors.transparent
                                }}
                                textCustomStyle={{ color: colors.primaryColor }} />
                        </View>
                    }
                    {
                        sessionDetail?.session_details?.status === 'paid' &&
                        <View style={{ marginTop: hp('15%') }}>
                            <CustomButton
                                onPress={async () => {
                                    await AsyncStorage.setItem('session_started', 'true');
                                    resetNavigation(navigation, "VideoCall", {
                                        sessionDetail: {
                                            channel_name: sessionId?.session_id,
                                            session_duration: sessionDetail?.session_details?.duration,
                                            coach_id: sessionDetail?.coach?.coach_id,
                                            coachee_id: sessionDetail?.coachee?.coachee_id,
                                            area_name: sessionDetail?.coaching_area_name,
                                            coach_name: sessionDetail?.coach?.name,
                                            coachee_name: sessionDetail?.coachee?.name,
                                            sessionStarted: true
                                        }
                                    })
                                }}
                                title={t('startSession')}
                                customStyle={{}} />
                        </View>
                    }
                </ScrollView>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    secondContainer: {
        margin: 20,
        flex: 1
    },

    conatinerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50
    },
    profileContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 35,
    },
    badge: {
        position: 'absolute',
        bottom: -8,
        right: 0,
    },
    title: {
        fontSize: 19,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.primaryColor,
    },
    rateStyle: {
        fontSize: 17,
        fontFamily: fonts.fontsType.regular,
        color: colors.blackTransparent,
        marginStart: 5
    },
    ratingContainer: {
        flexDirection: 'row',

    },
    statusTitle: {
        fontSize: 15,
        fontFamily: fonts.fontsType.semiBold,
    },
});

export default SessionDetails;
