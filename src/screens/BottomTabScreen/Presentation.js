import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Image, FlatList, Dimensions,
    ActivityIndicator, RefreshControl
} from 'react-native';
import colors from '../../theme/colors';
import { Badge } from '@rneui/themed';
import HeaderComponent from '../../components/HeaderComponent';
import SessionListIcon from '../../assets/svgs/session_list_icon.svg'
import MonthList from '../../components/MonthList';
import { ButtonGroup } from "@rneui/themed";
import fonts from '../../theme/fonts';
import RateStarIcon from '../../assets/svgs/rate_star_icon.svg'
import { fetchUpcomingAndCompleted } from '../../redux/CoacheeSlices/upcomingAndCompletedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId } from '../../redux/DashboardSlices/setCategoryIdSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SessionListItem from './Components/SessionListItem';
import CoachSessionListItem from './Components/CoachSessionListItem';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import EmptyDataView from '../../components/EmptyDataView';
import { setReceiverId } from '../../redux/setReceiverIdSlice';
import useBackHandler from '../../components/useBackHandler';
import { setSessionEnded } from '../../redux/sessionEndedSlice';
import CustomModal from '../../components/CustomModal';
import { useIsFocused } from '@react-navigation/native';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../utilities/currentLanguage';

const Presentation = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { response, status } = useSelector((state) => state.coacheeUpcomingAndCompleted)
    const { sessionEnded } = useSelector((state) => state.sessionEnded);
    const { role } = useSelector((state) => state.userLogin)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [postStatus, setPostStatus] = useState('paid');
    const [refreshing, setRefreshing] = useState(false);

    const numColumns = 2;
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        if (!isFocused)
            dispatch(setSessionEnded({
                isSessionCompleted: false
            }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused])


    useEffect(() => {
        dispatch(fetchUpcomingAndCompleted({ status: postStatus, role: role }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, postStatus, selectedIndex])

    const handleSetCategoryId = (categoryId, screenName, session_id) => {
        dispatch(setCategoryId(categoryId))
        dispatch(setSessionId({ session_id: session_id, route: 'MyCoaching' }))
        resetNavigation(navigation, screenName)
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                //handleSetCategoryId(item?.session_info?.coach_id, "CoachDetail")
                handleSetCategoryId(item?.session_info?.coach_id, "CoachingDetail",
                    item?.session_info?.session_details?.session_id)
            }}
            style={styles.itemContainer}>
            <Image
                style={styles.image}
                source={{ uri: item?.session_info?.coach_profile_pic && item?.session_info?.coach_profile_pic }}
            />
            {/* <View style={styles.overlay}>
                <Text style={styles.overlayText}>Available Today</Text>
            </View> */}
            <View style={{
                flexDirection: 'row',
                // marginStart: 5
            }}>

                <Text style={styles.coachNameStyle}>
                    {`${item?.session_info?.coach_name?.split(' ')[0]}`}
                </Text>
                <Badge
                    badgeStyle={{ backgroundColor: 'black' }}
                    containerStyle={{
                        alignSelf: 'center',
                        marginStart: 5,
                    }} />

                <RateStarIcon
                    width={16}
                    height={16}
                    style={{ alignSelf: 'center', marginStart: 5 }} />

                <Text style={styles.rateStyle}>
                    {`${Math.round(item?.session_info?.coach_avg_rating * 10) / 10}`}
                </Text>
            </View>
            <Text style={styles.categoryTextStyle}>
                {currentLanguage === "de" ?
                    (item?.session_info?.coaching_area_name?.german_name?.length > 13 ? item?.session_info?.coaching_area_name?.german_name.slice(0, 16) : item?.session_info?.coaching_area_name?.german_name) :
                    (item?.session_info?.coaching_area_name?.length > 13 ? item?.session_info?.coaching_area_name.slice(0, 16) : item?.session_info?.coaching_area_name) + '...'}
            </Text>
        </TouchableOpacity>
    );

    const handleNavigation = (item) => {
        dispatch(setSessionEnded({
            isSessionCompleted: false
        }))
        const params = {
            sessionItem: item
        }
        resetNavigation(navigation, 'SessionReviewBooking', params)
    }

    const handleCoachNavigation = (item, screenName) => {
        dispatch(setSessionEnded({
            isSessionCompleted: false
        }))
        dispatch(setSessionId({
            session_id: item?.session_info?.session_details?.session_id,
            route: 'Dashboard'
        }))
        resetNavigation(navigation, screenName)
    }

    const renderSessions = ({ item }) => (
        (role === 'coachee' ? <SessionListItem sessionDetail={item} onPress={() => {
            handleNavigation(item)
        }} /> : <CoachSessionListItem sessionDetail={item} onPress={() => {

            dispatch(setReceiverId({
                receiverId: item?.session_info?.coachee_id,
                role: role === 'coach' ? 'coachee' : 'coach'
            }))
            handleCoachNavigation(item, "SessionDetail")
        }} />)
    );

    const handleSessionListNav = (status, screenName) => {
        dispatch(setSessionEnded({
            isSessionCompleted: false
        }))
        dispatch(setSessionId({ session_status: status, route: 'MyCoaching' }))
        resetNavigation(navigation, screenName)
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const fetchData = async () => {

        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            await dispatch(fetchUpcomingAndCompleted({ status: postStatus, role: role }))
        } catch (error) {
            console.error('Error fetching coaches:', error);
        }
        setRefreshing(false);
    };


    return (
        <SafeAreaView style={styles.container}>

            <HeaderComponent
                customTextStyle={{ marginStart: 110 }}
                customContainerStyle={{ marginTop: hp('3%') }}
                headerTitle={role === 'coachee' ? t('myCoaching')
                    : t('mySessions')}
                icon={
                    <SessionListIcon
                        onPress={() => {
                            //navigation.navigate("SessionRequestedList")
                            if (role === 'coachee') {
                                handleSessionListNav('', 'CoachingList')
                            } else {
                                handleSessionListNav('pending,accepted,rejected', 'SessionRequestedList')
                            }

                        }} />
                } />

            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#ff0000', '#00ff00', '#0000ff']}
                />
            }>

                {/* <MonthList /> */}

                <ButtonGroup
                    buttons={[t('upcoming'), t('completed')]}
                    selectedIndex={sessionEnded?.isSessionCompleted ? 1 : selectedIndex}
                    onPress={(value) => {
                        setSelectedIndex(value);
                        if (value === 0) {
                            setPostStatus('paid');
                            dispatch(setSessionEnded({
                                isSessionCompleted: false
                            }))
                        }
                        else {
                            setPostStatus('completed');
                        }
                    }}
                    textStyle={styles.textStyle}
                    innerBorderStyle={styles.innerBorderStyle}
                    buttonContainerStyle={{ borderRadius: 32 }}
                    selectedButtonStyle={styles.selectedStyle}
                    containerStyle={styles.buttonGroup}
                />

                <View style={{
                    alignSelf: response?.sessions?.length === 1 ? 'flex-start' : 'center',
                    flex: 1,
                    justifyContent: 'center',
                    marginHorizontal: 16,
                    alignItems: response?.sessions?.length === 1 ? 'flex-start' : 'center'
                }}
                >
                    {
                        role === 'coachee' ? (
                            status === 'loading' ?
                                <ActivityIndicator
                                    style={{ alignSelf: 'center' }}
                                    size={'large'}
                                    color={colors.primaryColor} />
                                :
                                response?.sessions?.length > 0 ? <FlatList
                                    key={'_'}
                                    data={response?.sessions}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => index.toString() + item}
                                    numColumns={numColumns}
                                    showsVerticalScrollIndicator={false}
                                /> : <EmptyDataView showImage={false} message={t('emptyMessage')} />
                        ) :
                            (status === 'loading' ?
                                <ActivityIndicator
                                    style={{ alignSelf: 'center' }}
                                    size={'large'}
                                    color={colors.primaryColor} />
                                :
                                <View>
                                    {response?.sessions?.length > 0 ? <FlatList
                                        key={'#'}
                                        data={response?.sessions}
                                        renderItem={renderSessions}
                                        keyExtractor={(item, index) => index.toString() + item}
                                        showsVerticalScrollIndicator={false}
                                    /> : <EmptyDataView showImage={false} message={t('emptyMessage')} />}
                                </View>
                            )

                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    itemContainer: {
        width: 170,
        height: 176,
        position: 'relative',
        marginTop: 10,
        borderRadius: 12,
    },
    image: {
        height: 100,
        width: 140,
        borderRadius: 12,
    },
    overlay: {
        position: 'absolute',
        top: hp('10%'),
        left: 8,
        borderRadius: 16,
        backgroundColor: '#1CBA22',
        height: 25,
        width: hp('13%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#029008',
        borderWidth: 1
    },
    overlayText: {
        color: 'white',
        fontFamily: fonts.fontsType.bold,
        fontSize: 11,
        lineHeight: 13
    },
    categoryTextStyle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 13,
        lineHeight: 19,
        color: 'rgba(0, 0, 0, 0.6)'
    },
    seeAllTextStyle: {
        fontFamily: fonts.fontsType.map,
        fontSize: 15,
        lineHeight: 27,
        color: '#312802',
        marginStart: 10,
        alignSelf: 'center'
    },
    areaNameStyle: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 18,
        lineHeight: 27,
        color: colors.primaryColor,
        marginStart: 10,
        alignSelf: 'center',
        flex: 1
    },
    areaIconStyle: {
        width: 20,
        height: 20,
        alignSelf: 'center',
    },
    rateStyle: {
        fontSize: 13,
        lineHeight: 19,
        fontFamily: fonts.fontsType.regular,
        color: 'rgba(0, 0, 0, 0.6)',
        alignSelf: 'center',
        marginStart: 5
    },
    coachNameStyle: {
        fontSize: 14,
        lineHeight: 21,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.black,
        alignSelf: 'center',

    },
    buttonGroup: {
        marginBottom: 20,
        backgroundColor: "#F5F5F5",
        borderRadius: 32,
        marginTop: 30,
        marginHorizontal: 40,
        height: 46,
    },
    selectedStyle: {
        backgroundColor: colors.primaryColor,
        borderRadius: 32,
    },
    innerBorderStyle: { color: 'white', fontSize: 15, fontFamily: fonts.fontsType.medium },
    textStyle: { color: "#8E8E8E", fontSize: 15, fontFamily: fonts.fontsType.medium }
});

export default Presentation;
