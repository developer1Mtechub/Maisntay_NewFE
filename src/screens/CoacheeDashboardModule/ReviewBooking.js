import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import ProfileCard from '../../components/ProfileCard';
import fonts from '../../theme/fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/ButtonComponent';
import { postSessionsDetails } from '../../redux/DashboardSlices/postCoachDetailSessionSlice';
import moment from 'moment';
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import useBackHandler from '../../components/useBackHandler';
import { setAnyData, setUserId } from '../../redux/setAnyTypeDataSlice';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import { useAlert } from '../../providers/AlertContext';

const ReviewBooking = ({ navigation, route }) => {
    const { t } = useCustomTranslation();
    const { showAlert } = useAlert()
    const { sessionPayload } = route.params
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.postSessionDetail)


    const handlePostSessionDetail = () => {

        const newSessionTobeSend = {
            coach_id: sessionPayload?.coach_id,
            date: sessionPayload?.date,
            duration: sessionPayload?.duration,
            section: sessionPayload?.section,
            coaching_area_id: sessionPayload?.coaching_area_id,
            amount: sessionPayload?.amount,
        }
        dispatch(postSessionsDetails(newSessionTobeSend)).then((result) => {
            if (result?.payload?.success === true) {
                showAlert("Success", "success", "Request submitted successfully")
                setTimeout(() => {
                    resetNavigation(navigation, 'CoachingList')
                }, 3000);
            }
            else {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleBackPress = () => {
        resetNavigation(navigation, 'CoachDetail')
        return true;
    };

    useBackHandler(handleBackPress)

    const navigateToCoachReviews = () => {
        dispatch(setUserId({ user_id: sessionPayload?.coach_id }))
        dispatch(setAnyData({
            route: 'CoachDetail',
            coach_name: `${sessionPayload?.first_name} ${sessionPayload?.last_name}`
        }))
        resetNavigation(navigation, "MyReviews")
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.secondContainer}>

                <HeaderComponent
                    headerTitle={t('reviewBookingHeading')}
                    navigation={navigation}
                    navigateTo={'CoachDetail'}
                />

                <ProfileCard
                    profile_pic={sessionPayload?.profile_pic}
                    first_name={sessionPayload?.first_name}
                    last_name={sessionPayload?.last_name}
                    badgeName={sessionPayload?.badge_name}
                    rate={sessionPayload?.avg_rating}
                    ratePress={() => {
                        navigateToCoachReviews();
                    }}
                />
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
                            {sessionPayload?.cateory}
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
                            {/* {moment(sessionPayload?.date).format('ddd, MMM DD, YYYY')} */}
                            {moment(sessionPayload?.date).format('DD-MM-yyyy')}
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
                            {sessionPayload?.section}
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
                            {`${sessionPayload?.duration} minutes (CHF ${sessionPayload?.amount})`}
                        </Text>
                    </View>

                    <CustomButton
                        loading={status == 'loading' ? true : false}
                        onPress={() => { handlePostSessionDetail() }}
                        title={t('requestSessionButton')}
                        customStyle={{ marginTop: hp('20%') }} />
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
});

export default ReviewBooking;
