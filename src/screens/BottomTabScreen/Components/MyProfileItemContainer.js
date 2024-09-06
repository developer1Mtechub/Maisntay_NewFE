import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ForwardIcon from '../../../assets/svgs/forward_icon.svg'
import colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import getCurrentLanguage from '../../../utilities/currentLanguage';

const ProfileItem = ({ icon, headerText, subHeaderText = [], onPress, editIcon, areas = false }) => {
    const currentLanguage = getCurrentLanguage();
    const renderSubHeaderText = () => {
        if (Array.isArray(subHeaderText)) {
            return (
                <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ width: wp('68%'), marginTop: 5 }}>
                    {subHeaderText.map((item, index) => (
                        <Text key={index} style={styles.coinsTextStyle}>

                            {
                                areas ? currentLanguage === "de" ? item?.german_name : item?.name : item
                            }
                            {index !== subHeaderText?.length - 1 ? ', ' : ''}
                        </Text>
                    ))}
                </ScrollView>
            );
        }
        return <Text style={styles.coinsTextStyle}>{subHeaderText}</Text>;
    };

    return (
        <View style={styles.badgeContainer}>
            {icon && icon}
            <View style={styles.badgeHeaderContainer}>
                <Text style={[styles.badgeTextStyle, subHeaderText == '' && { top: 10 }]}>{headerText}</Text>
                {renderSubHeaderText()}
            </View>
            {
                editIcon ? (
                    <TouchableOpacity
                        style={{ alignSelf: 'center' }}
                        onPress={onPress}>
                        {editIcon}
                    </TouchableOpacity>
                ) :

                    (<TouchableOpacity
                        style={{ alignSelf: 'center' }}
                        onPress={onPress}>
                        <ForwardIcon
                            style={styles.iconStyle} />
                    </TouchableOpacity>)
            }

        </View>
    );
};

const styles = {
    badgeContainer: {
        // width: 340,
        width: wp('90%'),
        height: 65,
        // height: 60,
        backgroundColor: colors.primaryColor,
        alignSelf: 'center',
        borderRadius: 14,
        marginTop: 15,
        flexDirection: 'row',
    },
    badgeHeaderContainer: {
        alignSelf: 'center',
        marginStart: 15,
        marginTop: 5,
        flex: 1
    },
    badgeTextStyle: {
        fontFamily: fonts.fontsType.bold,
        color: colors.white,
        fontSize: 17,
        lineHeight: 27,
    },
    coinsTextStyle: {
        fontFamily: fonts.fontsType.medium,
        color: colors.white,
        fontSize: 13,
        lineHeight: 25,
    },
    iconStyle: {
        alignSelf: 'center',
        marginEnd: 20
    },
};

export default ProfileItem;
