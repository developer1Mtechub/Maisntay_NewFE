// This Component for coach to show coachee Session Requests
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import colors from '../../theme/colors';
import CoachSessionListItem from '../BottomTabScreen/Components/CoachSessionListItem';
import HeaderComponent from '../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSessionList } from '../../redux/Sessions/getSessionListSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import { setReceiverId } from '../../redux/setReceiverIdSlice';
import EmptyDataView from '../../components/EmptyDataView';
import useBackHandler from '../../components/useBackHandler';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../utilities/currentLanguage';


const SessionRequestedList = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useCustomTranslation();
    const { status, sessionList, error } = useSelector((state) => state.sessionList)
    const { role } = useSelector((state) => state.userLogin)
    const { sessionId } = useSelector((state) => state.setSessionId)
    // console.log('sessionList', JSON.stringify(sessionList))


    const handleBackPress = () => {
        resetNavigation(navigation, 'Dashboard', { screen: sessionId?.route })
        return true;
    };

    useBackHandler(handleBackPress)

    useEffect(() => {
        dispatch(fetchSessionList({ role: role, status: sessionId?.session_status }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const handleNavigation = (item, screenName) => {
        dispatch(setReceiverId({ receiverId: item?.session_info?.coachee_id, role: 'coachee' }))
        dispatch(setSessionId({
            session_id: item?.session_info?.session_details?.session_id,
            route: 'SessionRequestedList',
            session_status: sessionId?.session_status // this is added for return back to fetch list again..
        }))
        resetNavigation(navigation, screenName)
    }

    const renderSessions = ({ item }) => (
        <CoachSessionListItem
            isSessionRequest={true}
            sessionDetail={item}
            onPress={() => {
                handleNavigation(item, "RequestedSession")
            }} />
    );

    if (status === 'loading') {
        return <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.primaryColor} size={'large'} />
        </View>
    }



    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                navigation={navigation}
                navigateTo={'Dashboard'}
                params={{ screen: sessionId?.route }}
                headerTitle={sessionId?.session_status === 'paid' ? t('upcomingSessions') : t('sessionRequest')}
                customContainerStyle={{ marginStart: 20 }}
            />
            <View style={{ margin: 30, marginBottom: 50, flex: 1, justifyContent: 'center' }}>

                {sessionList?.sessions.length > 0 ? <FlatList
                    data={sessionList?.sessions}
                    renderItem={renderSessions}
                    keyExtractor={(item, index) => index.toString() + item}
                    showsVerticalScrollIndicator={false}
                /> : <EmptyDataView showImage={false} message={t('emptyMessage')} />
                }

            </View>

        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

//make this component available to the app
export default SessionRequestedList;
