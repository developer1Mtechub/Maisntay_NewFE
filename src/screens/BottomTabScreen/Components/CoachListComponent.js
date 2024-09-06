import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image,
    ScrollView, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import colors from '../../../theme/colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import fonts from '../../../theme/fonts';
import { Badge } from '@rneui/themed';
import RateStarIcon from '../../../assets/svgs/rate_star_icon.svg'
import ArrowForward from '../../../assets/svgs/see_all_forward_arrow.svg'
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoaches } from '../../../redux/DashboardSlices/getAllCoachesSlice';
import { resetNavigation } from '../../../utilities/resetNavigation';
import { setCategoryId } from '../../../redux/DashboardSlices/setCategoryIdSlice';
import { resetState } from '../../../redux/DashboardSlices/getAllCoachesSlice';
import { setSessionId } from '../../../redux/Sessions/setSessionIdSlice';
import { useIsFocused } from '@react-navigation/native';
import useCustomTranslation from '../../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../../utilities/currentLanguage';

const CoachListComponent = ({ navigation, searchQuery }) => {
    const { t } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const coaches = useSelector((state) => state.getAllCoaches.coaches);
    const status = useSelector((state) => state.getAllCoaches.status);
    const error = useSelector((state) => state.getAllCoaches.error);
    const { currentPage } = useSelector((state) => state.getAllCoaches);
    const { hasMore } = useSelector((state) => state.getAllCoaches);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let coachDetailPromise;
            try {
                if (isFocused) {
                    coachDetailPromise = dispatch(fetchCoaches({ pageSize: 3, page: 1 }));
                }
                await Promise.all([coachDetailPromise]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        if (!isFocused) {
            dispatch(resetState({ currentPage: 1, status: 'idle' }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, isFocused]);

    const loadMore = () => {
        if (status === 'succeeded' && hasMore) {
            dispatch(fetchCoaches({ pageSize: 3, page: currentPage }));
        }
    }

    const handleSetCategoryId = (categoryId, screenName, areaName) => {
        dispatch(setCategoryId(categoryId))
        dispatch(setSessionId({
            route: 'Dashboard'
        }))
        resetNavigation(navigation, screenName, { area_name: areaName })
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const fetchData = async () => {

        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            dispatch(resetState({ currentPage: 1 }))
            await dispatch(fetchCoaches({ pageSize: 3, page: 1 }));
        } catch (error) {
            console.error('Error fetching coaches:', error);
        }
        setRefreshing(false);
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                handleSetCategoryId(item?.user_id, "CoachDetail", '')
            }}
            style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: item?.profile_pic || 'https://via.placeholder.com/150?text=' }}
            />
            {/* <View style={styles.overlay}>
                <Text style={styles.overlayText}>Available Today</Text>
            </View> */}
            <View style={{
                flexDirection: 'row',
                // marginStart: 5
            }}>

                <Text style={styles.coachNameStyle}>
                    {/* {`${item?.first_name} ${item?.last_name}`} */}
                    {`${item?.first_name}`}
                </Text>
                <Badge
                    badgeStyle={{ backgroundColor: 'black' }}
                    containerStyle={{
                        alignSelf: 'center',
                        marginStart: 5,
                    }} />

                <RateStarIcon
                    width={16}
                    height={16}
                    style={{ alignSelf: 'center', marginStart: 5 }} />

                <Text style={styles.rateStyle}>
                    {/* {`${Math.round(item?.avg_rating)}`} */}
                    {`${Math.round(item?.avg_rating * 10) / 10}`}
                </Text>
            </View>
            <ScrollView
                // nestedScroll={true} 
                horizontal
                style={{
                    // marginTop: 5, marginStart: 5 
                }}
            >
                {item?.coaching_area_names?.slice(0, 1).map((area, index) => (
                    <React.Fragment key={index}>
                        <Text style={styles.categoryTextStyle}>
                            {currentLanguage === "de" ?
                                (area?.german_name?.length > 13 ? area?.german_name.slice(0, 16) : area?.german_name) :
                                (area?.name?.length > 13 ? area?.name.slice(0, 16) : area?.name) + '...'}
                        </Text>
                    </React.Fragment>
                ))}
            </ScrollView>
        </TouchableOpacity>
    );

    const renderSection = ({ item }) => {

        const filteredCoaches = item?.coaches?.filter(coach => {
            const fullName = `${coach?.first_name} ${coach?.last_name}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        });

        if (filteredCoaches?.length > 0) {
            return (
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={styles.areaIconStyle}
                            source={{ uri: item?.area_icon && item?.area_icon }} />
                        <Text numberOfLines={1} style={styles.areaNameStyle}>{currentLanguage === "de" ? item?.german_name : item?.area_name}</Text>

                        <Text
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => {
                                handleSetCategoryId(item?.area_id, 'CoachesCategory', currentLanguage === "de" ? item?.german_name : item?.area_name)
                            }}
                            style={styles.seeAllTextStyle}>{t('seeAll')}</Text>

                        <ArrowForward
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => {
                                handleSetCategoryId(item?.area_id, 'CoachesCategory', currentLanguage === "de" ? item?.german_name : item?.area_name)
                            }}
                            width={18}
                            height={18}
                            style={{
                                alignSelf: 'center'
                            }} />
                    </View>
                    <FlatList
                        data={filteredCoaches}
                        renderItem={renderItem}
                        keyExtractor={(coach, index) => coach.id.toString() + index}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            );
        }
    };

    const renderFooter = () => {

        if (status === 'loading') {
            return <ActivityIndicator size="large" color={colors.primaryColor} />; // Spinner at end of list
        }
        return null;
    };


    return (
        <View style={{ marginBottom: 30 }}>

            {
                loading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} color={colors.primaryColor} />
                    </View>
                    : <FlatList
                        data={coaches}
                        renderItem={renderSection}
                        keyExtractor={(area, index) => area?.area_id?.toString() + index}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMore}
                        onEndReachedThreshold={1.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#ff0000', '#00ff00', '#0000ff']}
                            />
                        }
                    />}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        // backgroundColor: colors.white,
        // shadowOpacity: 0.05,
        width: 170,
        height: 176,
        position: 'relative',
        marginTop: 10,
        //marginEnd: 10,
        marginEnd: -15,
        borderRadius: 12,

    },
    image: {
        // height: 126,
        // width: 170,
        height: 100,
        width: 140,

        borderRadius: 12,
    },
    overlay: {
        position: 'absolute',
        top: hp('10%'),
        left: 8,
        borderRadius: 16,
        backgroundColor: '#1CBA22',
        height: 25,
        width: hp('13%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#029008',
        borderWidth: 1
    },
    overlayText: {
        color: 'white',
        fontFamily: fonts.fontsType.bold,
        fontSize: 11,
        lineHeight: 13
    },
    categoryTextStyle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 13,

        color: 'rgba(0, 0, 0, 0.6)'
    },
    seeAllTextStyle: {
        fontFamily: fonts.fontsType.map,
        fontSize: 15,
        padding: 4,
        color: '#312802',
        marginStart: 10,
        alignSelf: 'center'
    },
    areaNameStyle: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 16,
        color: colors.primaryColor,
        marginStart: 10,
        alignSelf: 'center',
        flex: 1,
    },
    areaIconStyle: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        //tintColor:colors.primaryColor
    },
    rateStyle: {
        fontSize: 13,
        lineHeight: 19,
        fontFamily: fonts.fontsType.regular,
        color: 'rgba(0, 0, 0, 0.6)',
        alignSelf: 'center',
        marginStart: 5
    },
    coachNameStyle: {
        fontSize: 13,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.black,
        alignSelf: 'center',

    },
    plusSign: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 13,
        color: colors.primaryColor,
        bottom: 3,
        right: 5
    },
});

//make this component available to the app
export default CoachListComponent;
