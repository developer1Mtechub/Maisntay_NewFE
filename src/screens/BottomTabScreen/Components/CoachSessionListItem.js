import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../../../theme/colors';
import BadgeIcon from '../../../assets/svgs/coach_badge.svg'
import fonts from '../../../theme/fonts';
import HorizontalDivider from '../../../components/DividerLine';
import moment from 'moment';
import { useSelector } from 'react-redux';
import useCustomTranslation from '../../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../../utilities/currentLanguage';

const CoachSessionListItem = ({ sessionDetail, onPress, isSessionRequest }) => {
    const { t } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const { role } = useSelector((state) => state.userLogin);
    const [isLoading, setIsLoading] = useState(true);
    const BADGE_IMG = require('../../../assets/images/main_stays_badge_img.png')

    const badgeTintColors = {
        gold: '#FFD700',
        platinum: '#E5E4E2',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
    };

    //console.log(sessionDetail)

    const handleLoadEnd = () => {
        setIsLoading(false);
    };

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

        if (status === 'rejected') {
            return t('rejected')
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={{
            marginTop: 20
        }}>

            <View style={{ flexDirection: 'row' }}>

                <View style={{ alignSelf: 'center' }}>

                    <View style={styles.profileContainer}>
                        <Image
                            resizeMode='cover'
                            source={{
                                uri: sessionDetail?.session_info?.coachee_profile_pic || 'https://via.placeholder.com/150' // Placeholder image URL
                            }}
                            style={[styles.profileImage]}
                            onLoadEnd={handleLoadEnd}
                        />
                        {isLoading && <ActivityIndicator
                            style={styles.loader}
                            size="large"
                            color={colors.primaryColor} />}
                        {/* <BadgeIcon width={20} height={20} style={styles.badge} /> */}

                        {sessionDetail?.session_info?.coachee_badge && sessionDetail?.session_info?.coachee_badge !== 'NULL' &&
                            sessionDetail?.session_info?.coachee_badge != 'null' && <Image
                                style={{
                                    width: 20,
                                    height: 20,
                                    // alignSelf: 'center',
                                    // marginStart: 20,
                                    position: 'absolute',
                                    bottom: -6,
                                    right: 4,
                                    tintColor: badgeTintColors[sessionDetail?.session_info?.coachee_badge?.toLowerCase()]
                                }}
                                source={BADGE_IMG} />


                        }

                    </View>

                </View>

                <View style={{ flex: 1, top: 10, marginHorizontal: 8 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.title}>
                            {sessionDetail?.session_info?.coachee_name?.split(' ')[0]}
                        </Text>

                        {isSessionRequest && <Text
                            style={[
                                styles.title,
                                {
                                    fontSize: 13,
                                    color: sessionDetail?.session_info?.session_details?.status === 'pending' ?
                                        '#D88200' : sessionDetail?.session_info?.session_details?.status === 'completed' ||
                                            sessionDetail?.session_info?.session_details?.status === 'accepted' ?
                                            '#00BB34' : '#FF0000',
                                }
                            ]}>
                            {getStatus(sessionDetail?.session_info?.session_details?.status)}
                        </Text>}
                    </View>

                    <Text style={[styles.rateStyle]}>
                        {`${currentLanguage === "de" ? sessionDetail?.session_info?.german_name : sessionDetail?.session_info?.coaching_area_name}`}
                    </Text>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Text style={[styles.rateStyle]}>
                            {`${sessionDetail?.session_info?.session_details?.duration} min`}
                        </Text>

                        <Text style={[styles.rateStyle,]}>
                            {`${moment(sessionDetail?.session_info?.session_details?.date).format('DD MMM')}, ${sessionDetail?.session_info?.session_details?.section}`}
                        </Text>

                    </View>

                </View>

            </View>

            <HorizontalDivider
                height={1}
                customStyle={{ marginTop: 20, width: 320, marginStart: 10 }} />

        </TouchableOpacity>
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
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    badge: {
        position: 'absolute',
        bottom: -6,
        right: 0,
    },
    title: {
        fontSize: 15,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.black
    },
    rateStyle: {
        fontSize: 13,
        fontFamily: fonts.fontsType.regular,
        color: colors.blackTransparent,
        marginTop: 2,
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -18, // Adjust based on loader size
        marginTop: -16, // Adjust based on loader size
    },
});

//make this component available to the app
export default CoachSessionListItem;

