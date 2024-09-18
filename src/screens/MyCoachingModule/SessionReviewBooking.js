//for coachee Session Review Booking
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, Platform } from 'react-native';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import ProfileCard from '../../components/ProfileCard';
import fonts from '../../theme/fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/ButtonComponent';
import { postSessionStatus } from '../../redux/coachSlices/sessionAcceptRejectSlice';
import moment from 'moment';
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import ChatIcon from '../../assets/svgs/session_chat_icon.svg'
import { setReceiverId } from '../../redux/setReceiverIdSlice';
import PaymentModal from '../StripePaymentModule/PaymentModal';
import CancleIcon from "../../assets/svgs/cross_icon.svg";
import { BottomSheet } from '@rneui/themed';
import PaymentScreen from '../StripePaymentModule/PaymentScreen.android';
import useBackHandler from '../../components/useBackHandler';
import { setAnyData, setUserId } from '../../redux/setAnyTypeDataSlice';
import { fetchSessionDetailById } from '../../redux/Sessions/getSessionByIdSlice';
import FullScreenLoader from '../../components/CustomLoader';
import useCustomTranslation from '../../utilities/useCustomTranslation';

const SessionReviewBooking = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.sessionAcceptORReject)
    const sessionStatus = useSelector((state) => state.sessionDetailById.status)
    const { sessionId } = useSelector((state) => state.setSessionId)
    const { role } = useSelector((state) => state.userLogin)
    const { user_id } = useSelector(state => state.userLogin)
    const [payload, setPayload] = useState();
    const [showPaymentSheet, setShowPaymentSheet] = useState(false);
    const [sessionDetail, setSessionDetail] = useState({});



    const handleBackPress = () => {
        resetNavigation(navigation, sessionId?.route)
        return true;
    };

    useBackHandler(handleBackPress)


    const togglePaymentModal = () => {
        setShowPaymentSheet(!showPaymentSheet)
    };

    useEffect(() => {
        dispatch(fetchSessionDetailById({ sessionId: sessionId?.session_id })).then((result) => {
            if (result?.payload?.success === true) {
                setSessionDetail(result?.payload?.session?.session_data);
            }
        });
    }, [dispatch, sessionId])


    const handlePaymentNavigation = () => {

        const sessionPayload = {
            coach_id: sessionDetail?.coach?.coach_id,
            session_id: sessionDetail?.session_id,
            coachee_id: sessionDetail?.coachee?.coachee_id,
            amount: sessionDetail?.session_details?.amount
        }

        resetNavigation(navigation, "PaymentScreen",
            { paymentPayload: sessionPayload })
    }

    if (sessionStatus === 'loading') {
        return <FullScreenLoader visible={sessionStatus} />
    }


    const renderBottomSheet = () => {
        return (
            <BottomSheet
                onBackdropPress={() =>
                    togglePaymentModal()

                }
                modalProps={{}} isVisible={showPaymentSheet}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('55%'),
                        // borderTopEndRadius: 30,
                        // borderTopStartRadius: 30,
                        padding: 10,
                    }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 10
                    }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: "black",
                                fontFamily: fonts.fontsType.bold,
                            }}>
                            Make Payment
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                togglePaymentModal()
                            }}
                        />
                    </View>


                    <PaymentModal
                        onClose={() => { togglePaymentModal() }}
                        paymentPayload={payload}
                        navigation={navigation}
                    />

                </View>
            </BottomSheet>
        );
    };



    const navigateToCoachReviews = () => {
        dispatch(setUserId({ user_id: sessionDetail?.coach?.coach_id }))
        dispatch(setAnyData({
            route: 'CoachDetail',
            coach_name: `${sessionDetail?.coach?.name?.split(" ")[0]} ${sessionDetail?.coach?.name?.split(" ")[1]}`
        }))
        resetNavigation(navigation, "MyReviews")
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.secondContainer}>

                <HeaderComponent
                    headerTitle={t('reviewBookingHeading')}
                    navigation={navigation}
                    navigateTo={sessionId?.route}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <ProfileCard
                        profile_pic={sessionDetail?.coach?.profile_pic}
                        first_name={sessionDetail?.coach?.name?.split(" ")[0]}
                        last_name={sessionDetail?.coach?.name?.split(" ")[1]}
                        rate={sessionDetail?.coach?.coach_avg_rating}
                        status={sessionDetail?.session_details?.status}
                        chatButtonPress={() => {
                            resetNavigation(navigation, 'ChatScreen')
                            dispatch(setReceiverId({ receiverId: sessionDetail?.coach?.coach_id, role: 'coach' }))
                        }}
                        customContainerStyle={{ flex: 1 }}
                        badgeName={sessionDetail?.coach?.coach_badge}
                        ratePress={() => {
                            navigateToCoachReviews();
                        }}
                    />
                    {/* <ChatIcon style={{ marginTop: 30 }} onPress={() => {
                        resetNavigation(navigation, 'ChatScreen')
                        dispatch(setReceiverId({ receiverId: sessionItem?.session_info?.coach_id, role:'coach' }))
                    }} /> */}

                </View>
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

                    {sessionDetail?.session_details?.status === 'accepted' &&
                        role === 'coachee' &&
                        <CustomButton
                            loading={status == 'loading' ? true : false}
                            onPress={() => {
                                handlePaymentNavigation();
                            }}
                            title={t('payNowBtnTitle')}
                            customStyle={{ marginTop: hp('20%'), width: wp('90%') }} />}

                </ScrollView>
            </View>
            {renderBottomSheet()}
            {/* <PaymentScreen
                onClose={() => { togglePaymentModal() }}
                paymentPayload={payload}
                navigation={navigation}
            /> */}
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
});

export default SessionReviewBooking;
