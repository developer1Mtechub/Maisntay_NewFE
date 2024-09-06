// CustomBottomTabBar.js

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Platform } from 'react-native';
import fonts from '../theme/fonts';
import colors from '../theme/colors';

const CustomBottomTabBar = ({ state, descriptors, navigation, icons, chatBadgeCount }) => {
    const { routes } = state;

    return (
        <View style={styles.tabContainer}>
            {routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title !== undefined ? options.title : route.name;
                const Icon = options.icon; // Extract icon from options
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };


                const isChatScreen = route.name === 'Chat';

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabButton, isFocused && styles.selectedTab]}
                    >
                        <View style={{ position: 'relative' }}>
                            <Image
                                resizeMode='contain'
                                style={[styles.iconStyle, {
                                    tintColor: isFocused
                                        ? colors.primaryColor
                                        : colors.inActiveIconColor,
                                }]}
                                source={icons[index]} />
                            {isChatScreen && chatBadgeCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{chatBadgeCount}</Text>
                                </View>
                            )}
                        </View>
                        {isFocused && <Text style={styles.tabText}>{label}</Text>}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.white, // adjust as needed
        height: Platform.OS === 'ios' ? 80 : 56, // Adjust height for iOS and Android
        // height: Platform.OS === 'ios' ? 50 : 56, // change this because of in App.js i have used SafeAreaView otherwise use 80
        paddingBottom: Platform.OS === 'ios' ? 15 : 0, // Adjust padding for iOS
        shadowOpacity: 0.05,
        elevation: 4,
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingHorizontal: 10,
        marginTop: Platform.OS === 'ios' ? 15 : 0,
        height: 40
    },
    selectedTab: {
        backgroundColor: colors.tabBarItemBg,
    },
    tabText: {

        marginStart: 10,
        alignSelf: 'center',
        color: colors.primaryColor,
        fontFamily: fonts.fontsType.medium,
        fontSize: 15,
        lineHeight: 29
    },

    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontFamily: fonts.fontsType.medium,
        alignSelf: 'center'
    },
    iconStyle: {
        height: 24,
        width: 26,
        alignSelf: 'center',
    }
});

export default CustomBottomTabBar;

