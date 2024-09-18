import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import colors from '../../theme/colors';
import CoachListComponent from './Components/CoachListComponent';
import DashBoardHeader from './Components/DashBoardHeader';
import fonts from '../../theme/fonts';
import SearchIcon from '../../assets/svgs/search_gray.svg'
import CrossIcon from '../../assets/svgs/cross_icon.svg'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import CoachHomeSessionList from './Components/CoachHomeSessionList';
import { resetNavigation } from '../../utilities/resetNavigation';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import { useAlert } from '../../providers/AlertContext';

const Explore = ({ navigation }) => {
    const { showAlert } = useAlert();
    const { role } = useSelector((state) => state.userLogin)
    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { t } = useCustomTranslation();

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (

        <SafeAreaView style={styles.container}>

            <ScrollView stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false}>

                <Image style={styles.dashboardImageStyle}
                    source={require('../../assets/images/dashboard_log_img.png')} />
                <View style={{ marginHorizontal: 20, top: 20 }}>
                    <DashBoardHeader navigation={navigation} />
                    <Text onPress={() => {
                    }} style={styles.greetingMessageStyle}>{t('welcome')}</Text>
                </View>

                <View style={{ marginHorizontal: 25, top: 20 }}>
                    {role === 'coach' ? <View style={[styles.inputContainerStyle, {
                        backgroundColor: isFocused ? colors.transparent : 'rgba(238, 238, 238, 1)',
                        height: 45,
                        borderWidth: isFocused ? 1 : 0,
                        borderColor: isFocused ? colors.primaryColor : 'rgba(238, 238, 238, 1)',
                    }]}>
                        <SearchIcon style={{ marginStart: 10 }} />
                        <TextInput
                            onPressIn={() => {
                                if (role === 'coachee') {
                                    resetNavigation(navigation, "SearchCoaches")
                                }
                            }}
                            // editable={role === 'coachee' ? false : true}
                            placeholder={role === 'coachee' ? t('coacheeSearchLabel') : t('coachSearchLabel')}
                            value={searchText}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onChangeText={(text) => setSearchText(text)}
                            placeholderTextColor={'rgba(118, 118, 118, 1)'}
                            style={styles.inputStyle}
                        />
                        {searchText.length > 0 && <CrossIcon onPress={() => { setSearchText('') }} style={{ marginEnd: 5 }} />}
                    </View> : <View style={[styles.inputContainerStyle, {
                        backgroundColor: isFocused ? colors.transparent : 'rgba(238, 238, 238, 1)',
                        height: 45,
                        borderWidth: isFocused ? 1 : 0,
                        borderColor: isFocused ? colors.primaryColor : 'rgba(238, 238, 238, 1)',
                    }]}>
                        <SearchIcon style={{ marginStart: 10 }} />
                        <TouchableOpacity
                            onPress={() => {
                                resetNavigation(navigation, "SearchCoaches");
                            }}

                            style={styles.inputStyle}
                        >
                            <Text style={{
                                color: 'rgba(118, 118, 118, 1)',
                                fontFamily: fonts.fontsType.medium,
                                fontSize: 15,
                            }}>
                                {t('coacheeSearchLabel')}
                            </Text>
                        </TouchableOpacity>
                    </View>}
                </View>

                <View style={{
                    margin: 20,
                    // marginBottom: hp('30%')
                }}>


                    {role === 'coachee' ?
                        <CoachListComponent navigation={navigation} searchQuery={searchText} />
                        :
                        <CoachHomeSessionList searchQuery={searchText} navigation={navigation} />
                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    dashboardImageStyle: {
        width: 154,
        height: 42,
        alignSelf: 'center',
        marginTop: 10
    },
    greetingMessageStyle: {
        fontFamily: fonts.fontsType.regular,
        color: '#676767',
        fontSize: 17,
        lineHeight: 27,
        marginBottom: 10,
        marginTop: -5
    },
    inputStyle: {
        flex: 1,
        marginStart: 10,
        fontFamily: fonts.fontsType.medium,
        fontSize: 15,
        width: wp('100%'),

    },
    inputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 12,
        width: wp('88%')
    }

});

//make this component available to the app
export default Explore;
