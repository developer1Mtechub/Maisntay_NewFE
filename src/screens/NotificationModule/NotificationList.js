import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HeaderComponent from '../../components/HeaderComponent';
import EmptyDataView from '../../components/EmptyDataView';
import FullScreenLoader from '../../components/CustomLoader';
import { fetchNotification } from '../../redux/NotificationModuleSlices/getNotificationByUserSlice';
import { setAnyData, setUserId } from '../../redux/setAnyTypeDataSlice';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import useBackHandler from '../../components/useBackHandler';
import fonts from '../../theme/fonts';
import colors from '../../theme/colors';
import useCustomTranslation from '../../utilities/useCustomTranslation';

// Preloading images
const sessionImage = require('../../assets/images/session_img.png');

const NotificationItem = React.memo(({ notification, navigateBasedOnType, renderNotificationContent }) => {
  return (
    <TouchableOpacity
      onPress={() => navigateBasedOnType(notification.type, notification.title, notification.session_id)}
      style={styles.notificationContainer}>
      <Image source={sessionImage} style={styles.notificationImage} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationHeading}>{notification.title}</Text>
        <Text style={styles.notificationDescription}>
          {renderNotificationContent(notification.title, notification?.coach_full_name, notification?.coachee_full_name)}
        </Text>
        {/* <Text style={styles.notificationDescription}>{notification.content}</Text> */}
      </View>
    </TouchableOpacity>
  );
});

const NotificationComponent = ({ navigation }) => {
  const { t } = useCustomTranslation();
  const dispatch = useDispatch();
  const { status, notifications } = useSelector((state) => state.fetchNotification);
  const { role, user_id } = useSelector((state) => state.userLogin);
  const [loading, setLoading] = useState(true);
  const handleBackPress = useCallback(() => {
    resetNavigation(navigation, 'Dashboard');
    return true;
  }, [navigation]);

  useBackHandler(handleBackPress);

  const renderNotificationContent = (title, coach_full_name, coachee_full_name) => {

    if (role === 'coachee' && title === "SESSION_ACCEPTED") {
      return `${coach_full_name} has accepted Your session request.`;
    }

    if (role === 'coachee' && title === "PAYMENT_SUCCESSFUL") {
      return `You have payed successfully to ${coach_full_name}.`;
    }

    if (role === 'coach' && title === "PAYMENT_SUCCESSFUL") {
      return `Payment received for session with ${coachee_full_name}.`;
    }

    if (role === 'coachee' && title === "WELL_COINS_RECEIVED") {
      return `Congratulations! You received new Wellcoins.`;
    }

    if ((role === 'coachee' || role === "coach") && title === "BADGES") {
      return `Congratulation you have received the new badges, Keep Going.`;
    }

    if (role === 'coach' && title === "SESSION_REQUEST") {
      return `You have a new session request from ${coachee_full_name}`;
    }

    if (role === 'coach' && title === "SESSION_REVIEW") {
      return `You have received review from ${coachee_full_name}`;
    }

    if (role === 'coachee' && title === "SESSION_STARTED") {
      return `${coach_full_name} has started the session.`;
    }
  };

  const navigateBasedOnType = (type, title, session_id) => {
    switch (type) {
      case 'SESSION':
        if (title === 'SESSION_REQUEST') {
          if (role === 'coachee') {
            dispatch(setSessionId({
              session_id: session_id,
              route: 'NotificationList'
            }));
            resetNavigation(navigation, 'SessionReviewBooking');
          } else {
            dispatch(setSessionId({
              session_id: session_id,
              route: 'NotificationList'
            }));
            resetNavigation(navigation, 'RequestedSession');
          }
        } else if (title === 'SESSION_REVIEW') {
          if (role === 'coachee') {
            dispatch(setSessionId({
              session_id: session_id,
              route: 'NotificationList'
            }));
            resetNavigation(navigation, 'RateTheCoach');
          } else {
            dispatch(setUserId({ user_id: user_id }));
            dispatch(setAnyData({
              route: 'NotificationList'
            }));
            resetNavigation(navigation, 'MyReviews');
          }
        } else if (title === 'SESSION_ACCEPTED') {
          if (role === 'coachee') {
            dispatch(setSessionId({
              session_id: session_id,
              route: 'NotificationList'
            }));
            resetNavigation(navigation, 'SessionReviewBooking');
          } else {
            // Add handling for SESSION_ACCEPTED for coach
          }
        }
        break;
      case 'PAYMENT':
        if (role === 'coach') {
          dispatch(setUserId({
            user_id: user_id
          }));
          dispatch(setAnyData({
            route: 'NotificationList'
          }));
          resetNavigation(navigation, 'MyWallet');
        } else {
          resetNavigation(navigation, 'Dashboard', { screen: 'MyCoaching' });
        }
        break;
      case 'WELL_COINS':
        if (role === 'coachee') {
          dispatch(setAnyData({
            route: 'NotificationList'
          }));
          resetNavigation(navigation, 'WellcoinsDetails');
        }
        break;
      case 'BADGES':
        if (role === 'coachee') {
          resetNavigation(navigation, 'CoacheeBadges');
        } else {
          resetNavigation(navigation, 'BadgesScreen');
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      let notificationPromise;
      try {
        notificationPromise = dispatch(fetchNotification());
        await Promise.all([notificationPromise]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const renderNotificationItem = ({ item }) => {
    const isCoacheeAndNotSessionRequest = role === 'coachee' && item?.title !== "SESSION_REQUEST" &&
      item?.title !== "SESSION_ENDED" && item?.title !== "SESSION_REVIEW";
    const isCoachAndNotSessionAccepted = role === 'coach' && item?.title !== "SESSION_ACCEPTED" &&
      item?.title !== "SESSION_ENDED" && item?.title !== "SESSION_STARTED" && item?.title !== "WELL_COINS_RECEIVED";

    if (isCoacheeAndNotSessionRequest || isCoachAndNotSessionAccepted) {
      return (
        <NotificationItem
          notification={item}
          navigateBasedOnType={navigateBasedOnType}
          renderNotificationContent={renderNotificationContent}
        />
      );
    }
    return null;
  };


  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent
        navigation={navigation}
        navigateTo="Dashboard"
        headerTitle={t('notificationHeaderTitle')}
      />
      {loading ? (
        <FullScreenLoader visible={loading ? 'loading' : 'nothing'} />
      ) : notifications?.result?.length > 0 ? (
        <FlatList
          data={notifications.result}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotificationItem}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyDataView showImage={false} message={t('noNewNotification')} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 0.4,
    shadowOpacity: 0.1,
  },
  notificationImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 30,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeading: {
    fontSize: 14,
    fontFamily: fonts.fontsType.semiBold,
    marginBottom: 5,
    color: '#312802',
  },
  notificationDescription: {
    fontSize: 12,
    fontFamily: fonts.fontsType.medium,
    color: '#312802',
    opacity: 0.6,
  },
});

export default NotificationComponent;
