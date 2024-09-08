import React, { useEffect, useState } from 'react';
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
import FullScreenLoader from '../../components/CustomLoader';
import useBackHandler from '../../components/useBackHandler';
import { setAnyData, setUserId } from '../../redux/setAnyTypeDataSlice';
import TextCheckBox from '../../components/testCheckbox';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../utilities/currentLanguage';
import { useAlert } from '../../providers/AlertContext';


const CoachDetails = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useCustomTranslation()
    const { showAlert } = useAlert()
    const currentLanguage = getCurrentLanguage();
    const { coachDetails, status, error } = useSelector((state) => state.getCoachDetail)
    const { coachSections } = useSelector((state) => state.coachSection)
    const coachSectionStatus = useSelector((state) => state.coachSection.status)
    const { durations } = useSelector((state) => state.durations)
    const durationStatus = useSelector((state) => state.durations.status)
    const coachId = useSelector((state) => state.categoryId.categoryId)
    const { sessionId } = useSelector((state) => state.setSessionId)
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [durationSheetVisible, setDurationSheetVisible] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [loading, setLoading] = useState(true);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    function getEnabledDays(payload) {
        // Check if payload is empty
        if (!payload || Object.keys(payload).length === 0) {
            console.log("Payload is empty.");
            return [];
        }

        const enabledDays = [];
        for (const day in payload) {
            if (payload[day].enabled) {
                enabledDays.push(day);
            }
        }

        return enabledDays;
    }


    const handleBackPress = () => {
        if (sessionId?.route === 'CoachesCategory') {
            resetNavigation(navigation, sessionId?.route, { area_name: sessionId?.area_name })
        } else {
            resetNavigation(navigation, sessionId?.route)
        }

        return true;
    };

    useBackHandler(handleBackPress)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const coachDetailPromise = dispatch(fetchCoachDetail({ coachId, chatRole: 'coach' }));
                const coachSectionPromise = dispatch(fetchCoachSection({ coachId }));
                const sessionDurationsPromise = dispatch(fetchSessionDurations({ coachId }));

                await Promise.all([coachDetailPromise, coachSectionPromise, sessionDurationsPromise]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, coachId]);


    const handleAreaSelection = (selectedAreas) => {
        setSelectedAreas(selectedAreas);
    };


    // Function to get array of start times for a selected day
    function getStartTimesForDay(schedule, selectedDay) {
        const startTimes = [];
        if (schedule[selectedDay] && schedule[selectedDay].enabled) {
            schedule[selectedDay].timeSessions.forEach(session => {
                startTimes.push(session.start);
            });
        }
        return startTimes;
    }

    const highlightedDates = {
        '2024-04-27': { marked: true, dotColor: 'green' },
        '2024-04-29': { marked: true, dotColor: 'green' },
    };

    const handleSelectDate = (date, selectedDay) => {
        setSelectedDate(date);
        const startTimes = getStartTimesForDay(coachSections?.sections?.section_list[0]?.section_details
            && coachSections?.sections?.section_list[0]?.section_details, selectedDay);
        setTimeSlots(startTimes)
    };



    const handleSelectTime = (time) => {
        setSelectedTime(time);
    };


    const handleReviewSession = () => {

        if (selectedDuration === null) {
            showAlert("Success", "success", t('selectAtleastOneDurationError'))
            return;
        }

        const sessionPayload = {
            coach_id: coachId,
            date: selectedDate,
            duration: selectedDuration?.value,
            section: selectedTime,
            coaching_area_id: selectedAreas[0].areaId,
            amount: selectedDuration?.amount,
            profile_pic: coachDetails?.details?.profile_pic || coachDetails?.profile_pic,
            first_name: coachDetails?.first_name,
            last_name: coachDetails?.last_name,
            cateory: selectedAreas[0]?.area,
            badge_name: coachDetails?.badges?.name,
            avg_rating: coachDetails?.avg_rating
        }
        setDurationSheetVisible(false)
        navigation.navigate('ReviewBooking', { sessionPayload: sessionPayload })
    }



    const handleCheckboxClick = (duration) => {
        setSelectedDuration(duration);
    };



    const renderDuration = (item, index) => {
        if (item?.amount > 0) {
            return <TouchableOpacity
                onPress={() => {
                    handleCheckboxClick(item);
                }}
                key={index} style={{ margin: 8 }}>
                <View
                    style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                    <Text
                        style={{
                            flex: 1,
                            fontFamily: fonts.fontsType.medium,
                            fontSize: 17,
                            color: "rgba(115, 115, 115, 1)",
                            lineHeight: 29,
                        }}>
                        {`${item?.value} Minutes (CHF ${item?.amount && item?.amount || 0})`}
                    </Text>
                    <TextCheckBox
                        isChecked={selectedDuration === item}
                        onToggle={() => {
                            handleCheckboxClick(item);
                        }}
                    />
                    {/* <CustomCheckbox
                        checkedColor="rgba(15, 109, 106, 1)"
                        uncheckedColor="rgba(238, 238, 238, 1)"
                        onToggle={() => {
                            handleCheckboxClick(item);
                        }}
                    /> */}
                </View>
                <HorizontalDivider height={1} customStyle={{ marginTop: 5 }} />
            </TouchableOpacity>
        }

    }


    const renderDurationSheet = () => {
        return (
            <BottomSheet
                onBackdropPress={() =>
                    setDurationSheetVisible(false)

                }
                modalProps={{}} isVisible={durationSheetVisible}>

                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('53%'),
                        borderTopEndRadius: 16,
                        borderTopStartRadius: 16,
                        padding: 20,
                    }}>

                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: "rgba(49, 40, 2, 1)",
                                fontFamily: fonts.fontsType.semiBold,
                            }}>
                            {t('selectDurationPrompt')}
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                setDurationSheetVisible(false);
                            }}
                        />
                    </View>

                    <ProfileCard
                        profile_pic={coachDetails?.details?.profile_pic ||
                            coachDetails?.profile_pic}
                        first_name={coachDetails?.first_name}
                        last_name={coachDetails?.last_name}
                        customContainerStyle={{ marginTop: 20 }}
                        areas={selectedAreas[0]?.area}
                        isChatButton={false}
                        customProfileImageStyle={{
                            width: 55,
                            height: 55,
                            borderRadius: 25,
                        }}
                    />

                    <View style={{ padding: 10, }}>


                        <ScrollView>
                            {
                                durations?.duration?.details.map((item, index) =>
                                    renderDuration(item, index)
                                )
                            }
                        </ScrollView>

                    </View>

                    <CustomButton
                        onPress={() => {
                            handleReviewSession()
                        }}
                        title={t('continueButton')}
                        customStyle={{ marginTop: 20 }} />

                </View>
            </BottomSheet>
        );
    };

    const handleRequestSessionButton = () => {
        if (selectedAreas.length === 0 || selectedTime == null) {
            Toast.show(t('selectAreaAndSessionTime'));
            return
        }
        setDurationSheetVisible(true)
    }

    const handleChatNavigation = () => {
        resetNavigation(navigation, 'ChatScreen')
        dispatch(setReceiverId({ receiverId: coachId, role: 'coach' }))
    }

    if (loading) {
        return <FullScreenLoader visible={loading ? 'loading' : 'nothing'} />;
    }

    const navigateToCoachReviews = () => {
        dispatch(setUserId({ user_id: coachId }))
        dispatch(setAnyData({
            route: 'CoachDetail',
            coach_name: `${coachDetails?.first_name} ${coachDetails?.last_name}`
        }))
        resetNavigation(navigation, "MyReviews")
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.secondContainer}>
                <HeaderComponent
                    headerTitle={t('coachesHeaderTitle')}
                    navigation={navigation}
                    navigateTo={sessionId?.route}
                    params={{
                        area_name: sessionId?.route === 'CoachesCategory' && sessionId?.area_name
                    }}
                    customContainerStyle={{ marginTop: 0 }}
                />

                <ProfileCard
                    profile_pic={coachDetails?.details?.profile_pic || coachDetails?.profile_pic}
                    first_name={coachDetails?.first_name}
                    last_name={coachDetails?.last_name}
                    badgeName={coachDetails?.badges?.name}
                    chatButtonPress={() => {
                        handleChatNavigation()
                    }}
                    rate={coachDetails?.avg_rating}
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
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ flexDirection: 'row', }}>

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
                            {t('languageLabel')}
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

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {t('selectCategoryLabel')}
                        </Text>
                        <MultiSelectAreas
                            areas={coachSections?.sections?.coaching_area_list}
                            selectedAreas={selectedAreas}
                            onSelect={handleAreaSelection}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {t('bookingAvailabilityLabel')}
                        </Text>
                        <CustomCalendar
                            initialSelectedDate={selectedDate}
                            highlightedDayNames={getEnabledDays(coachSections?.sections?.section_list[0]?.section_details)}
                            onSelectDate={handleSelectDate}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fonts.fontsType.semiBold,
                            lineHeight: 27,
                            color: colors.primaryColor
                        }}>
                            {t('selectTimeLabel')}
                        </Text>

                        <CustomTimeSlots
                            times={timeSlots}
                            selectedTime={selectedTime}
                            onSelectTime={handleSelectTime}
                        />
                    </View>


                    <CustomButton
                        onPress={() => {
                            handleRequestSessionButton()
                        }}
                        title={t('requestSessionButton')}
                        customStyle={{ marginTop: 40, width: wp('90%') }} />
                </ScrollView>
            </View>

            {renderDurationSheet()}

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

export default CoachDetails;
