import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import colors from '../../theme/colors';
import SessionListItem from '../BottomTabScreen/Components/SessionListItem';
import HeaderComponent from '../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSessionList } from '../../redux/Sessions/getSessionListSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import FullScreenLoader from '../../components/CustomLoader';
import EmptyDataView from '../../components/EmptyDataView';
import useBackHandler from '../../components/useBackHandler';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import useCustomTranslation from '../../utilities/useCustomTranslation';


const MyCoachingList = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { status, sessionList, error } = useSelector((state) => state.sessionList)
    const { role } = useSelector((state) => state.userLogin)

    const handleBackPress = () => {
        resetNavigation(navigation, 'Dashboard', { screen: "MyCoaching" })
        return true;
    };

    useBackHandler(handleBackPress)

    useEffect(() => {
        dispatch(fetchSessionList({ role: role, status: 'pending,accepted,rejected' }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const handleNavigation = (item) => {
        dispatch(setSessionId({
            session_id: item?.session_info?.session_details?.session_id,
            route: 'CoachingList'
        }))
        resetNavigation(navigation, 'SessionReviewBooking')
    }

    const renderSessions = ({ item }) => (
        <SessionListItem sessionDetail={item} onPress={() => {
            handleNavigation(item)
        }} />
    );

    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }



    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                navigation={navigation}
                navigateTo={'Dashboard'}
                headerTitle={t('requestedSession')}
                params={{ screen: "MyCoaching" }}
                customContainerStyle={{ marginStart: 20, marginTop: 10 }}
            />
            <View style={{ margin: 30, flex: 1, marginTop: 10 }}>

                {sessionList?.sessions?.length > 0 ? <FlatList
                    data={sessionList?.sessions}
                    renderItem={renderSessions}
                    keyExtractor={(item, index) => index.toString() + item}
                    showsVerticalScrollIndicator={false}
                /> :

                    <EmptyDataView showImage={false} message={t('sessionNotAvailable')} />
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
export default MyCoachingList;
