import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import { BottomSheet } from '@rneui/themed';
import BadgeIcon from '../../assets/svgs/coach_badge.svg'
import ProfileCard from '../../components/ProfileCard';
import fonts from '../../theme/fonts';
import CancleIcon from "../../assets/svgs/cross_icon.svg";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HorizontalDivider from '../../components/DividerLine';
import MultiSelectAreas from '../../components/MultiSelectAreas';
import CustomCalendar from '../../components/CustomCalendar';
import CustomTimeSlots from '../../components/CustomTimeSlots';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachDetail } from '../../redux/DashboardSlices/getSingleCoachDetailSlice';
import { fetchCoachSection } from '../../redux/DashboardSlices/getSectionByCoachSlice';
import { fetchSessionDurations } from '../../redux/DashboardSlices/getDurationSlice';
import CustomButton from '../../components/ButtonComponent';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import { setReceiverId } from '../../redux/setReceiverIdSlice';
import Toast from 'react-native-simple-toast';
import { fetchSessionDetailById } from '../../redux/Sessions/getSessionByIdSlice';
import { setCategoryId } from '../../redux/DashboardSlices/setCategoryIdSlice';
import { color } from '@rneui/base';
import { fetchRatingBySession } from '../../redux/CoacheeSlices/getRatingBySessionSlice';
import { Rating, AirbnbRating } from 'react-native-ratings';
import useBackHandler from '../../components/useBackHandler';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import moment from 'moment';
import FullScreenLoader from '../../components/CustomLoader';
import { setAnyData, setUserId } from '../../redux/setAnyTypeDataSlice';
import CustomModal from '../../components/CustomModal';
import { setSessionEnded } from '../../redux/sessionEndedSlice';
import { useIsFocused } from '@react-navigation/native';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../utilities/currentLanguage';


const CoachingDetail = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { coachDetails, status, error } = useSelector((state) => state.getCoachDetail)
    const { role } = useSelector((state) => state.userLogin)
    const { response } = useSelector((state) => state.ratingBySession)
    const { sessionEnded } = useSelector((state) => state.sessionEnded);
    const coachId = useSelector((state) => state.categoryId.categoryId)
    const session_id = useSelector((state) => state.setSessionId.sessionId.session_id)
    const sessionRoute = useSelector((state) => state.setSessionId.sessionId.route)
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [sessionDetail, setSessionDetail] = useState({});
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        subtitle: '',
        buttonText: t('okBtnTitle'),
        icon: null,
        flatButtonText: ''
    });

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };





    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const coachDetailPromise = dispatch(fetchCoachDetail({ coachId: coachId, chatRole: 'coach' }));
                const coachSectionPromise = dispatch(fetchSessionDetailById({ sessionId: session_id })).then((result) => {
                    if (result?.payload?.success === true) {
                        setSessionDetail(result?.payload?.session?.session_data);
                    }
                });
                const coachRating = dispatch(fetchRatingBySession({ session_id: session_id }));

                await Promise.all([coachDetailPromise, coachSectionPromise, coachRating]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, coachId, session_id]);


    const checkSessionEnded = useCallback(async () => {
        if (sessionDetail?.session_details?.status === 'completed' && sessionRoute === 'VideoCall') {
            toggleModal()
            setModalContent({
                title: t('sessionEndedTitle'),
                subtitle: `${t('sessionEndedSubtitle')} ${coachDetails?.first_name} ${coachDetails?.last_name}`,
                buttonText: t('sessionEndedButtonText'),
                icon: require('../../assets/images/session_ended.png'),
                flatButtonText: t('sessionEndedFlatButtonText')
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session_id, isFocused, sessionDetail]);


    useEffect(() => {
        checkSessionEnded();
    }, [checkSessionEnded, isFocused, sessionDetail]);


    const handleRateTheCoachNavigation = () => {
        if (sessionEnded?.isSessionCompleted) {
            dispatch(setSessionEnded({
                isSessionCompleted: false,
                coach_name: '',
                role: 'nothing'
            }))
        }
        dispatch(setSessionId({
            session_id: session_id,
            route: 'CoachingDetail',
        }))
        resetNavigation(navigation, "RateTheCoach")
    }


    const handleChatNavigation = () => {
        resetNavigation(navigation, 'ChatScreen')
        dispatch(setReceiverId({ receiverId: coachId, role: 'coach' }))
    }

    const handleBookSessionNavigation = (user_id, screenName) => {
        dispatch(setCategoryId(user_id))
        dispatch(setSessionId({
            route: 'Dashboard'
        }))
        resetNavigation(navigation, screenName)
    }

    const handleBackPress = () => {
        resetNavigation(navigation, 'Dashboard', { screen: "MyCoaching" })
        return true;
    };

    useBackHandler(handleBackPress)

    if (loading) {
        return <FullScreenLoader visible={loading ? 'loading' : 'noting'} />
    }

    const navigateToCoachReviews = () => {
        dispatch(setUserId({ user_id: coachId }))
        dispatch(setAnyData({
            route: 'CoachingDetail',
            coach_name: `${coachDetails?.first_name} ${coachDetails?.last_name}`
        }))
        resetNavigation(navigation, "MyReviews")
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.secondContainer}>
                <HeaderComponent
                    headerTitle={t('coachingDetailTitle')}
                    navigation={navigation}
                    navigateTo={'Dashboard'}
                    params={{ screen: "MyCoaching" }}
                    customContainerStyle={{ marginTop: 0 }}
                />

                <ProfileCard
                    profile_pic={coachDetails?.details?.profile_pic || coachDetails?.profile_pic}
                    first_name={coachDetails?.first_name}
                    last_name={coachDetails?.last_name}
                    badgeName={coachDetails?.badges?.name}
                    // rate={coachDetails?.session_details?.rating}
                    rate={coachDetails?.avg_rating}
                    chatButtonPress={() => {
                        handleChatNavigation()
                    }}
                    customContainerStyle={{}}
                    isChatButton={true}
                    ratePress={() => {
                        navigateToCoachReviews();
                    }}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{}}>

                    <View style={{ marginTop: 30 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {t('categoryLabel')}
                        </Text>
                        <ScrollView horizontal style={{ flexDirection: 'row', }}>

                            {coachDetails?.coaching_areas ? coachDetails?.coaching_areas?.map((area, index) => {

                                return <Text key={index} style={{
                                    fontSize: 14,
                                    fontFamily: fonts.fontsType.medium,
                                    lineHeight: 27,
                                    color: colors.blackTransparent
                                }}>
                                    {currentLanguage === "de" ? area?.german_name : area?.name}
                                    {index !== coachDetails?.coaching_areas?.length - 1 ? ', ' : ''}
                                </Text>

                            }) : <Text style={{
                                fontSize: 14,
                                fontFamily: fonts.fontsType.medium,
                                lineHeight: 27,
                                color: colors.blackTransparent
                            }}>
                                {t('nA')}
                            </Text>}

                        </ScrollView>

                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {t('languagesLabel')}
                        </Text>
                        <View style={{ flexDirection: 'row', width: wp('80%') }}>

                            {coachDetails?.languages ? coachDetails?.languages?.map((language, index) => {

                                return <Text key={index} style={{
                                    fontSize: 14,
                                    fontFamily: fonts.fontsType.medium,
                                    lineHeight: 27,
                                    color: colors.blackTransparent
                                }}>
                                    {language}
                                    {index !== coachDetails?.languages?.length - 1 ? ', ' : ''}
                                </Text>

                            }) : <Text style={{
                                fontSize: 14,
                                fontFamily: fonts.fontsType.medium,
                                lineHeight: 27,
                                color: colors.blackTransparent
                            }}>
                                {t('nA')}
                            </Text>}

                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {t('aboutLabel')}
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.medium,
                            lineHeight: 27,
                            color: colors.blackTransparent,

                        }}>
                            {/* {coachDetails?.about ? coachDetails?.about : 'N/A'} */}
                            {showFullDescription
                                ? coachDetails?.about
                                : `${(coachDetails?.about?.length > 90 ? coachDetails?.about?.slice(0, 90)
                                    : coachDetails?.about)}...`}
                        </Text>

                        {(
                            <TouchableOpacity onPress={toggleDescription}>
                                <Text
                                    style={{
                                        color: colors.primaryColor,
                                        fontFamily: fonts.fontsType.medium,
                                        fontSize: 15,
                                        alignSelf: 'flex-end',
                                    }}>
                                    {!showFullDescription ? t('seeMore') : t('seeLess')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <HorizontalDivider customStyle={{ marginTop: 20 }} />

                    <Text style={{
                        fontSize: 16,
                        fontFamily: fonts.fontsType.semiBold,
                        lineHeight: 27,
                        color: colors.primaryColor,
                        marginTop: 30
                    }}>
                        {t('bookingDetailsTitle')}
                    </Text>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.regular,
                            color: '#000000',
                            opacity: 6,
                            lineHeight: 27

                        }}>
                            {t('categoryLabel')}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            color: '#333333'
                        }}>
                            {sessionDetail?.coaching_area_name}
                        </Text>

                    </View>


                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.regular,
                            color: '#000000',
                            opacity: 6,
                            lineHeight: 27
                        }}>
                            {t('dateLabel')}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            color: '#333333'
                        }}>
                            {moment(sessionDetail?.session_details?.date).format('DD-MM-yyyy')}
                        </Text>

                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.regular,
                            color: '#000000',
                            opacity: 6,
                            lineHeight: 27
                        }}>
                            {t('durationLabel')}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            color: '#333333'
                        }}>
                            {`${sessionDetail?.session_details?.duration} Minutes`}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.fontsType.regular,
                            color: '#000000',
                            opacity: 6,
                            lineHeight: 27
                        }}>
                            {t('statusLabel')}
                        </Text>

                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            color: '#333333'
                        }}>
                            {`${sessionDetail?.session_details?.status}`}
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
                                {t('yourRatingTitle')}
                            </Text>

                            <View style={{ marginTop: 10 }}>

                                <AirbnbRating
                                    isDisabled={true}
                                    showRating={false}
                                    count={5}
                                    selectedColor='rgba(255, 227, 78, 1)'
                                    unSelectedColor='rgba(199, 199, 199, 1)'
                                    defaultRating={response?.result?.rating}
                                    size={25}
                                    starContainerStyle={{
                                        justifyContent: 'space-between',
                                        marginLeft: '-58%'
                                    }}
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
                        // upcomingStatus == 'completed' && <CustomButton
                        sessionDetail?.session_details?.status === 'completed' && <CustomButton
                            onPress={() => {

                                handleRateTheCoachNavigation()
                            }}
                            title={response?.result && response?.result?.rating &&
                                response?.result?.comment ? t('updateRating') : t('rateTheCoach')}
                            customStyle={{ marginTop: 40, width: wp('90%') }} />

                    }

                    {
                        // upcomingStatus == 'upcoming' && <CustomButton
                        sessionDetail?.session_details?.status === 'paid' && <CustomButton
                            onPress={() => {
                                resetNavigation(navigation, "VideoCall", {
                                    sessionDetail: {
                                        channel_name: sessionDetail?.session_id,
                                        session_duration: sessionDetail?.session_details?.duration,
                                        coach_id: sessionDetail?.coach?.coach_id,
                                        coachee_id: sessionDetail?.coachee?.coachee_id,
                                        area_name: sessionDetail?.coaching_area_name,
                                        coach_name: sessionDetail?.coach?.name,
                                        coachee_name: sessionDetail?.coachee?.name,
                                        //sessionStarted: false
                                    }
                                })
                            }}
                            title={t('joinSession')}
                            customStyle={{ marginTop: 40, width: wp('90%') }} />
                    }

                    <CustomButton
                        onPress={() => {
                            handleBookSessionNavigation(coachId, "CoachDetail")
                        }}
                        title={t('bookNewSession')}
                        textCustomStyle={{ color: colors.primaryColor }}
                        customStyle={{
                            marginTop: -30,
                            width: wp('90%'),
                            backgroundColor: colors.transparent,

                        }} />



                </ScrollView>
            </View>

            <CustomModal
                isVisible={modalVisible}
                onClose={toggleModal}
                title={modalContent.title}
                subtitle={modalContent.subtitle}
                buttonText={modalContent.buttonText}
                icon={modalContent.icon}
                flatButtonText={modalContent.flatButtonText && modalContent.flatButtonText}
                onFlatButtonPress={async () => {
                    resetNavigation(navigation, "Dashboard")
                }}
                solidButtonPress={() => {
                    handleRateTheCoachNavigation();
                }}
            />

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

export default CoachingDetail;
