import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import BellIcon from '../../../assets/svgs/bell_icon.svg'
import BellIconBadge from '../../../assets/svgs/bell_icon_without_dot.svg'
import BadgeStar from '../../../assets/svgs/badge_star_icon.svg'
import { useSelector, useDispatch } from 'react-redux';
import { getData } from '../../../utilities/localStorage';
import { fetchCoacheeWellcoins } from '../../../redux/CoacheeSlices/getWellcoinsSlice';
import { resetNavigation } from '../../../utilities/resetNavigation';
import { getNotificationCount } from '../../../redux/NotificationModuleSlices/getNotificationCountSlice';
import { updateNotificationStatus } from '../../../redux/NotificationModuleSlices/updateNotificationStatusSlice';

const DashBoardHeader = ({ navigation }) => {
    const dispatch = useDispatch();
    const { role } = useSelector((state) => state.userLogin)
    const { response, status } = useSelector((state) => state.coacheeWellcoins)
    const { notificationCount } = useSelector((state) => state.notificationCount)
    const { notificationResponse } = useSelector((state) => state.updateNotification)
    const { user_name } = useSelector((state) => state.userLogin)

    console.log('notificationCount', notificationCount)
    //console.log('notificationResponse', notificationResponse)

    const [fullName, setFullName] = useState(null);
    useEffect(() => {
        const getUserData = async () => {
            const userData = await getData('userData');
            if (userData && userData.user && userData.user.first_name && userData.user.last_name) {
                const { first_name, last_name } = userData.user;
                setFullName(`${first_name} ${last_name}`);
            } else {
                // Handle the case where userData or userData.user or their properties are undefined
            }
        };
        getUserData();
    }, [fullName]);

    useEffect(() => {
        dispatch(fetchCoacheeWellcoins({ limit: 0 }));
    }, [dispatch])

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getNotificationCount());
        }, 5000); // 20000 milliseconds = 20 seconds
        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleUpdateNotification = () => {
        dispatch(updateNotificationStatus());
    }

    return (
        <View style={styles.container}>
            <Text style={styles.userNameStyle}>{`${(typeof fullName !== 'undefined' && fullName)
                || (typeof user_name !== 'undefined' && user_name)},`}</Text>

            <TouchableOpacity
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                onPress={() => {
                    handleUpdateNotification();
                    resetNavigation(navigation, "NotificationList");
                }}
                style={{ justifyContent: 'center' }}>
                {notificationCount?.count > 0 ? <BellIcon style={{ alignSelf: 'center', marginRight: 10 }} /> :
                    <BellIconBadge style={{ alignSelf: 'center', marginRight: 10 }} />}
            </TouchableOpacity>
            {role === 'coachee' && <TouchableOpacity
                onPress={() => {
                    resetNavigation(navigation, 'WellcoinsDetails')
                }}
                style={styles.badgeContainer}>
                <BadgeStar style={{ marginStart: 5 }} />
                {
                    status === 'loading' ? <ActivityIndicator
                        style={{ marginStart: 5 }}
                        size={'small'}
                        color={'white'} /> :


                        <Text style={styles.badgeTextStyle}>
                            {response?.overallTotalCoins >= 100 ? '99+' :
                                response?.overallTotalCoins || '0'}</Text>
                }

            </TouchableOpacity>}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        //marginHorizontal:10,
        marginTop: 10,
    },
    userNameStyle: {
        fontFamily: fonts.fontsType.semiBold,
        color: '#312802',
        fontSize: 23,
        //lineHeight: 47,
        flex: 1,
        marginBottom: 8
    },
    badgeContainer: {
        width: 65,
        height: 30,
        borderRadius: 50,
        backgroundColor: colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    badgeTextStyle: {
        fontFamily: fonts.fontsType.medium,
        color: colors.white,
        fontSize: 13,
        lineHeight: 27,
        marginStart: 3,
        marginEnd: 5,
        alignSelf: 'center'
    }
});

//make this component available to the app
export default DashBoardHeader;
