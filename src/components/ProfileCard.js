import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you're using react-native-vector-icons
import fonts from '../theme/fonts';
import colors from '../theme/colors';
import BadgeIcon from '../assets/svgs/coach_badge.svg'
import RateStar from '../assets/svgs/rate_star_icon.svg'
import { widthPercentageToDP as wp, } from 'react-native-responsive-screen';
import ChatIcon from '../assets/svgs/session_chat_icon.svg'
import { resetNavigation } from '../utilities/resetNavigation';
import getCurrentLanguage from '../utilities/currentLanguage';
const ProfileCard = ({ profile_pic,
    first_name,
    last_name,
    rate,
    customContainerStyle,
    areas,
    customProfileImageStyle,
    status,
    specialized,
    chatButtonPress,
    isChatButton,
    badgeName,
    ratePress
}) => {
    const BADGE_IMG = require('../assets/images/main_stays_badge_img.png')
    const currentLanguage = getCurrentLanguage();
    const badgeTintColors = {
        gold: '#FFD700',
        platinum: '#E5E4E2',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
    };

    const getStatus = (status) => {
        if (status === 'pending') {
            return 'Pending'
        }
        if (status === 'accepted') {
            return 'Accepted'
        }

        if (status === 'completed') {
            return 'Completed'
        }

        if (status === 'rejected') {
            return 'Rejected'
        }
    }


    const renderAreasText = () => {
        if (Array.isArray(areas)) {
            return (
                <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ width: wp('65%') }}>
                    {areas.map((item, index) => (
                        <Text
                            key={index}
                            style={[styles.rateStyle, { marginStart: 0, marginTop: 5 }]}>
                            {currentLanguage === "de" ? item?.german_name : item?.name}
                            {index !== areas?.length - 1 ? ', ' : ''}
                        </Text>
                    ))}
                </ScrollView>
            );
        }
        return <Text
            style={[styles.rateStyle, { marginStart: 0, marginTop: -5 }]}>
            {areas}
        </Text>;
    };

    return (
        <View style={[styles.container, customContainerStyle]}>
            <View style={styles.profileContainer}>
                <Image
                    resizeMode='cover'
                    source={{ uri: profile_pic || 'https://via.placeholder.com/150?text=' }} // Replace with actual image URI
                    style={[styles.profileImage, customProfileImageStyle]}
                />
                {/* <Icon name="star" size={20} color="gold" style={styles.badge} /> */}
                {/* {!areas && <BadgeIcon width={20} height={20} style={styles.badge} />} */}
                {
                    !areas && (badgeName != 'NULL' && badgeName != undefined) && < Image
                        style={{
                            width: 20,
                            height: 20,
                            // alignSelf: 'center',
                            // marginStart: 20,
                            position: 'absolute',
                            bottom: -4,
                            right: 0,
                            tintColor: badgeTintColors[badgeName?.toLowerCase()]
                        }}
                        source={BADGE_IMG} />

                }
            </View>
            <View style={{ marginStart: 15, flex: 1 }}>
                {<Text style={[styles.title, { top: rate ? 10 : -10 }]}>{`${first_name} ${last_name !== undefined ? last_name : ''}`}</Text>}
                {specialized && <Text
                    style={[styles.rateStyle, { marginStart: 0, marginTop: 5 }]}>
                    {specialized}
                </Text>}
                {
                    areas && renderAreasText()
                    // areas && <Text
                    //     style={[styles.rateStyle, { marginStart: 0, marginTop: 5 }]}>
                    //     {areas}
                    // </Text>
                }
                {!areas && rate != undefined && <TouchableOpacity
                    onPress={ratePress}
                    style={{
                        flexDirection: 'row',
                        marginTop: 10
                    }}>
                    {/* <Icon name="star" size={20} color="gold" /> */}
                    <RateStar width={20} height={20} style={{ alignSelf: 'center' }} />
                    {/* <Text style={styles.rateStyle}>{`${parseInt(rate)?.toFixed(1)}`}</Text> */}
                    <Text style={styles.rateStyle}>{`${Math.round(rate * 10) / 10}`}</Text>
                </TouchableOpacity>}

                {status && <Text
                    style={[styles.statusTitle,
                    {
                        fontSize: 13,
                        //marginTop: 10,
                        color: status === 'pending' ?
                            '#D88200' : status === 'completed' || status === 'accepted' ?
                                '#00BB34' : status === 'rejected' ? '#FF0000' : '#fff',
                    }]}>
                    {getStatus(status)}
                </Text>}
            </View>

            {isChatButton && <ChatIcon width={50} height={50} onPress={chatButtonPress} />}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        //marginTop: 50,
        marginTop: 30
    },
    profileContainer: {
        position: 'relative',
    },
    profileImage: {
        // width: 75,
        // height: 75,
        width: 60,
        height: 60,
        borderRadius: 35,
    },
    badge: {
        position: 'absolute',
        //bottom: -8,
        bottom: -4,
        right: 0,
    },
    title: {
        fontSize: 16,
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

export default ProfileCard;
