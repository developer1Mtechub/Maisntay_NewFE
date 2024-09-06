import React, { useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    Image, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Badge } from '@rneui/themed';
import RateStarIcon from '../../assets/svgs/rate_star_icon.svg'
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderComponent from '../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachByArea, resetState } from '../../redux/DashboardSlices/getCoachByCategorySlice';
import { setCategoryId } from '../../redux/DashboardSlices/setCategoryIdSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import useBackHandler from '../../components/useBackHandler';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import getCurrentLanguage from '../../utilities/currentLanguage';

const CoachesByCategory = ({ navigation, route }) => {
    const { area_name } = route.params
    const dispatch = useDispatch();
    const currentLanguage = getCurrentLanguage();
    const { categoryId } = useSelector(state => state.categoryId);
    const { status, currentPage, coaches, error, hasMore } = useSelector(state => state.getCoachByArea);
    //console.log('categoryId',categoryId)
    // console.log('currentPage',currentPage)
    // console.log('status',status)
    //console.log('coaches',coaches)
    console.log('error', error)


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCoachByArea({ pageSize: 40, page: currentPage, areaId: categoryId }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, categoryId]);

    // const loadMore = () => {
    //     // if (hasMore && currentPage > 1) {
    //     //     dispatch(fetchCoaches({ pageSize: 3, page: currentPage + 1 }));
    //     // }

    //     if (status === 'succeeded') {
    //         dispatch(fetchCoachByArea({ pageSize: 10, page: currentPage, areaId: categoryId }));
    //     }


    // }

    const loadMore = () => {
        if (status === 'succeeded' && !hasMore) {
            // Case where status is 'succeeded' and there's no more data
            console.log('No more data available.');
        } else if (status === 'succeeded') {
            // Case where status is 'succeeded' and there's more data to load
            dispatch(fetchCoachByArea({ pageSize: 10, page: currentPage, areaId: categoryId }));
        }
    }

    const handleSetCategoryId = (user_id, screenName) => {
        dispatch(setCategoryId(user_id))
        dispatch(setSessionId({
            route: 'CoachesCategory',
            area_name: area_name
        }))
        resetNavigation(navigation, screenName)
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                handleSetCategoryId(item?.user_id, "CoachDetail")
            }}
            style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: item?.profile_pic && item?.profile_pic }}
            />
            {/* <View style={styles.overlay}>
                <Text style={styles.overlayText}>Available Today</Text>
            </View> */}
            <View style={{
                flexDirection: 'row',
                marginStart: 5,
                marginTop: 10
            }}>

                <Text style={styles.coachNameStyle}>
                    {`${item?.first_name} ${item?.last_name}`}
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
                    {`${Math.round(item?.avg_rating * 10) / 10}`}
                </Text>
            </View>
            <ScrollView
                horizontal
                style={{ marginTop: 5, }} >
                {item?.coaching_areas.map((area, index) => (
                    <Text key={index} style={styles.categoryTextStyle}>
                        {currentLanguage === "de" ? area?.german_name : area?.name}
                        {index !== item?.coaching_areas.length - 1 ? ', ' : ''}
                    </Text>
                ))}
            </ScrollView>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (status === 'loading' && currentPage === 1) {
            return null
        }
        if (status === 'loading') {
            return <ActivityIndicator size="large" color={colors.primaryColor} />; // Spinner at end of list
        }
        if (status === 'failed') {
            return <Text>Error: {error}</Text>;
        }
        return null;
    };

    const handleBackPress = () => {
        resetNavigation(navigation, 'Dashboard')
        dispatch(resetState({ status: 'idle', currentPage: 1, coaches: [] }))
        return true;
    };

    useBackHandler(handleBackPress)

    return (
        <SafeAreaView style={styles.flatListContainer}>
            <HeaderComponent
                headerTitle={`${area_name} Coaches`}
                navigation={navigation}
                navigateTo={'Dashboard'}
                customContainerStyle={{ marginTop: 0 }}
                isStatusReset={true}
                customTextStyle={{
                    fontSize: area_name?.length > 13 ? 18 : 20,
                    flex: area_name?.length > 13 ? 0 : 1,
                    marginStart: area_name?.length > 13 ? 5 : 40
                }}
            />
            <View style={{ flex: 1, margin: 20, }}>
                <FlatList
                    data={coaches}
                    renderItem={renderItem}
                    keyExtractor={(index, item) => item + index}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 20, marginBottom: 20 }}
                    ListFooterComponent={renderFooter}
                    onEndReached={loadMore}
                    onEndReachedThreshold={1}
                />
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    flatListContainer: {
        // margin: 20,
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        // backgroundColor: colors.white,
        // shadowOpacity: 0.05,
        width: wp('90%'),
        height: 268,
        position: 'relative',
        marginTop: 10,
        marginEnd: 10,

    },
    image: {
        height: 208,
        width: wp('90%'),
        borderRadius: 12,
        alignSelf: 'center'
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
        lineHeight: 19,
        color: 'rgba(0, 0, 0, 0.8)',
        textAlign: 'left',
        marginStart: 5
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
        fontSize: 14,
        lineHeight: 21,
        fontFamily: fonts.fontsType.semiBold,
        color: colors.black,
        alignSelf: 'center',

    }
});

export default CoachesByCategory;
