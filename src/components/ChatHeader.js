import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import BackButton from '../assets/svgs/backArrow.svg'
import { Badge } from '@rneui/themed';
import fonts from '../theme/fonts';
import useCustomTranslation from '../utilities/useCustomTranslation';

const ChatHeader = ({ name, profilePic, online, onPress }) => {
    const { t } = useCustomTranslation();
    return (
        <View style={styles.container}>
            <View style={styles.backButtonContainer}>
                <BackButton onPress={onPress} />
            </View>
            <View style={styles.profileContainer}>
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{name}</Text>
                    {online &&
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.onlineStatus}>{t('activeNow')}</Text>
                            <Badge containerStyle={{alignSelf:'center', marginStart:5}} status="success" />
                        </View>
                    }

                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#ffffff',
        marginTop: 20
    },
    backButtonContainer: {
        // Style your back button container
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    profileInfo: {
        marginLeft: 10,
    },
    profileName: {
        fontSize: 16,
        fontFamily: fonts.fontsType.regular,
        color: 'rgba(0, 0, 0, 1)'
    },
    onlineStatus: {
        fontSize: 12,
        fontFamily: fonts.fontsType.regular,
        color: 'rgba(0, 0, 0, 0.2)',
        alignSelf:'center'
    },
});

export default ChatHeader;
