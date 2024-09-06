import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, FlatList, TouchableOpacity,
    Image, StyleSheet, SafeAreaView, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { fetchCoaches, resetState } from '../../redux/DashboardSlices/getAllCoachesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId } from '../../redux/DashboardSlices/setCategoryIdSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import fonts from '../../theme/fonts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../theme/colors';
import SearchIcon from '../../assets/svgs/search_gray.svg'
import CrossIcon from '../../assets/svgs/cross_icon.svg'
import BackArrow from "../../assets/svgs/backArrow.svg";
import HorizontalDivider from '../../components/DividerLine';
import useBackHandler from '../../components/useBackHandler';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import { useIsFocused } from '@react-navigation/native';
import useCustomTranslation from '../../utilities/useCustomTranslation';

const SearchCoaches = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const navigationFocus = useIsFocused();
    const status = useSelector((state) => state.getAllCoaches.status);
    const coaches = useSelector((state) => state.getAllCoaches.coaches);
    const error = useSelector((state) => state.getAllCoaches.error);
    const currentPage = useSelector((state) => state.getAllCoaches.currentPage);
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const handleBackPress = () => {
        resetNavigation(navigation, 'Dashboard')
        return true;
    };

    useBackHandler(handleBackPress)

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        // Fetch recent searches from AsyncStorage
        const loadRecentSearches = async () => {
            try {
                const savedSearches = await AsyncStorage.getItem('recentSearches');
                if (savedSearches) {
                    setRecentSearches(JSON.parse(savedSearches));
                }
            } catch (error) {
                console.error('Error loading recent searches:', error);
            }
        };

        loadRecentSearches();
    }, []);

    useEffect(() => {

        if (navigationFocus) {
            dispatch(resetState({ status: 'idle', currentPage: 1 }))
        }
        if (status === 'idle') {
            dispatch(fetchCoaches({ pageSize: 3, page: 1 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (coaches) {
            setFilteredCoaches(coaches?.flatMap(item => item?.coaches));
        }
    }, [coaches]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = coaches?.flatMap(item =>
                item?.coaches?.filter(coach =>
                    (`${coach?.first_name} ${coach?.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            // Remove duplicates based on the coach's full name
            const uniqueFiltered = filtered.filter((coach, index, self) =>
                index === self.findIndex((c) => (
                    `${c?.first_name} ${c?.last_name}` === `${coach?.first_name} ${coach?.last_name}`
                ))
            );
            setFilteredCoaches(uniqueFiltered);
        } else {
            setFilteredCoaches(coaches?.flatMap(item => item?.coaches));
        }
    }, [searchTerm, coaches]);

    const loadMore = () => {
        if (status === 'succeeded') {
            dispatch(fetchCoaches({ pageSize: 3, page: currentPage + 1 }));
        }
    };

    const handleSetCategoryId = (categoryId, screenName, areaName) => {
        dispatch(resetState({ status: 'idle', currentPage: 1 }))
        dispatch(setCategoryId(categoryId));
        dispatch(setSessionId({
            route: 'SearchCoaches'
        }))
        resetNavigation(navigation, screenName, { area_name: areaName });
    };

    const handleSearch = (text) => {
        setSearchTerm(text);
    };

    const handleRecentSearch = async (coach) => {
        const name = `${coach?.first_name} ${coach?.last_name}`;
        const profile_pic = coach?.profile_pic;
        const user_id = coach?.user_id;
        if (!recentSearches.find(item => item?.name === name)) {
            const updatedSearches = [...recentSearches, { name, profile_pic, user_id }];
            setRecentSearches(updatedSearches);

            // Save recent searches to AsyncStorage
            try {
                await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
            } catch (error) {
                console.error('Error saving recent searches:', error);
            }
        }
    };

    const clearRecentSearch = async (index) => {
        const updatedSearches = recentSearches.filter((_, i) => i !== index);
        setRecentSearches(updatedSearches);

        // Update recent searches in AsyncStorage
        try {
            await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        } catch (error) {
            console.error('Error clearing recent search:', error);
        }
    };

    const handleSelectCoach = (coach) => {
        handleRecentSearch(coach);
        setSearchTerm('');
    };

    const renderCoachItem = ({ item, index }) => (
        <TouchableOpacity
            onPress={() => {
                handleSetCategoryId(item?.user_id, "CoachDetail", '')
            }}
            style={styles.recentSearchItem}>
            <Image
                style={styles.profileImage}
                source={{ uri: item?.profile_pic || 'https://via.placeholder.com/150?text=' }}
            />
            <Text style={styles.coachName}>{item?.name}</Text>
            <TouchableOpacity onPress={() => clearRecentSearch(index)}>
                <CrossIcon width={28} height={28} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderSearchResultItem = ({ item }) => {
        if (item?.first_name && item?.profile_pic) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        handleSelectCoach(item)
                        handleSetCategoryId(item?.user_id, "CoachDetail", '')
                    }}
                    style={styles.searchResultItem}
                >
                    <Image
                        style={styles.profileImage}
                        source={{ uri: item?.profile_pic || 'https://via.placeholder.com/150?text=' }}
                    />
                    <Text style={styles.coachName}>
                        {`${item?.first_name} ${item?.last_name}`}
                    </Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const renderDivider = () => (

        <HorizontalDivider />
    );
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <BackArrow
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            height={32}
                            width={32}
                            style={{ alignSelf: "center", padding: 15 }}
                            onPress={() => {
                                dispatch(resetState({ status: 'idle', currentPage: 1 }))
                                resetNavigation(navigation, 'Dashboard')
                            }}
                        />
                        <View style={[
                            styles.inputContainerStyle, {
                                backgroundColor: isFocused ? colors.transparent : 'rgba(238, 238, 238, 1)',
                                height: 45,
                                borderWidth: isFocused ? 1 : 0,
                                borderColor: isFocused ? colors.primaryColor : 'rgba(238, 238, 238, 1)',
                            }
                        ]}>
                            <SearchIcon style={{ marginStart: 10 }} />
                            <TextInput
                                placeholder={t('searchCoaches')}
                                value={searchTerm}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChangeText={handleSearch}
                                placeholderTextColor={'rgba(118, 118, 118, 1)'}
                                style={styles.inputStyle}
                            />
                            {searchTerm.length > 0 && <CrossIcon onPress={() => { setSearchTerm('') }} style={{ marginEnd: 5 }} />}
                        </View>
                    </View>
                    {searchTerm ? (
                        <FlatList
                            data={filteredCoaches}
                            keyboardShouldPersistTaps={'handled'}
                            renderItem={renderSearchResultItem}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={
                                <HorizontalDivider
                                    customStyle={{
                                        width: wp('90%'),
                                        alignSelf: 'center'
                                    }}
                                />
                            }
                            onEndReached={loadMore}
                            onEndReachedThreshold={1.5}
                        />
                    ) : (
                        <View style={{ margin: 30 }}>
                            <Text style={styles.recentSearchTitle}>
                                {t('recentSearchs')}
                            </Text>
                            <FlatList
                                data={recentSearches}
                                keyboardShouldPersistTaps={'handled'}
                                renderItem={renderCoachItem}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={renderDivider}
                            />
                        </View>
                    )}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
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
        borderRadius: 12,
        width: wp('80%'),
        marginHorizontal: 10,
    },
    recentSearchItem: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        marginStart: -10
    },
    searchResultItem: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 10,
        marginTop: 10
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    coachName: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 15,
        color: '#312802',
        marginStart: 10,
        flex: 1
    },
    recentSearchTitle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 17,
        color: colors.primaryColor,
    },
});

export default SearchCoaches;
