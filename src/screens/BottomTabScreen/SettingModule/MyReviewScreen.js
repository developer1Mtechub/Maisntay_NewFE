import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import ReviewListItem from '../Components/MyReviewComponent';
import colors from '../../../theme/colors';
import HeaderComponent from '../../../components/HeaderComponent';
import { Text } from 'react-native-elements';
import fonts from '../../../theme/fonts';
import { Rating } from 'react-native-ratings';
import { fetchMyReviews } from '../../../redux/coachSlices/myReviewsSlice';
import { fetchAverageRating } from '../../../redux/coachSlices/getAverageRatingSlice';
import { useDispatch, useSelector } from 'react-redux';
import FullScreenLoader from '../../../components/CustomLoader';
import { resetNavigation } from '../../../utilities/resetNavigation';
import useBackHandler from '../../../components/useBackHandler';
import useCustomTranslation from '../../../utilities/useCustomTranslation';


const MyReviewScreen = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { reviewsList, status } = useSelector((state) => state.myReviews)
    const { response } = useSelector((state) => state.averageRating)
    const { user_id } = useSelector((state) => state.anyData)
    const { anyData } = useSelector((state) => state.anyData)

    const handleBackPress = () => {
        if (anyData?.route === 'NotificationList') {
            resetNavigation(navigation, anyData?.route)
        }
        else if (anyData?.route === 'CoachDetail') {
            resetNavigation(navigation, anyData?.route)
        }
        else if (anyData?.route === 'CoachingDetail') {
            resetNavigation(navigation, anyData?.route)
        }
        else {
            resetNavigation(navigation, "Dashboard", { screen: "Setting" })
        }

        return true;
    };

    useBackHandler(handleBackPress)

    useEffect(() => {
        dispatch(fetchMyReviews({ user_id: user_id }))
        dispatch(fetchAverageRating({ user_id: user_id }))
    }, [dispatch, user_id])

    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }


    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                headerTitle={(anyData?.route === 'CoachDetail' || anyData?.route === 'CoachingDetail') ? anyData?.coach_name : t('myReviews')}
                navigateTo={anyData?.route === 'NotificationList' ? 'NotificationList' : anyData?.route === 'CoachDetail' ?
                    'CoachDetail' : anyData?.route === 'CoachingDetail' ?
                        'CoachingDetail' : "Dashboard"}
                navigation={navigation}
                params={(anyData?.route !== 'CoachDetail' ||
                    anyData?.route !== 'CoachingDetail' ||
                    anyData?.route !== 'NotificationList') && { screen: 'Setting' }}
                customContainerStyle={{ marginStart: 20 }}
                customTextStyle={{ marginStart: anyData?.route === 'CoachDetail' ? 20 : 50 }}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <Text style={{
                    fontFamily: fonts.fontsType.bold,
                    fontSize: 41,
                    color: colors.primaryColor
                }}>
                    {response?.averageRating}
                </Text>

                <Rating
                    type='star'
                    readonly={true}
                    startingValue={response?.averageRating}
                    imageSize={25}
                    minValue={0}
                    ratingCount={5}
                    style={{ alignSelf: 'center', marginTop: 10 }}
                />

                <Text style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: 16,
                    color: colors.blackTransparent,
                    marginTop: 15
                }}>
                    {t('overAllRatings')}
                </Text>

            </View>
            <View style={styles.listContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={reviewsList?.result}
                    renderItem={({ item }) => (
                        <ReviewListItem
                            profilePic={item?.coachee?.profile_pic}
                            name={`${item?.coachee?.first_name} ${item?.coachee?.last_name}`}
                            rating={item.rating}
                            comment={item.comment}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    }
});

export default MyReviewScreen;
