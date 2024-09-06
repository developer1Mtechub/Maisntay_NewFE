import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './TabNavigator';
import CoachesByCategory from '../screens/CoacheeDashboardModule/CoachesByCategory';
import CoachDetails from '../screens/CoacheeDashboardModule/CoachDetails';
import ReviewBooking from '../screens/CoacheeDashboardModule/ReviewBooking';
import MyCoachingList from '../screens/MyCoachingModule/MyCoachingList';
import SessionReviewBooking from '../screens/MyCoachingModule/SessionReviewBooking';
import EditProfile from '../screens/BottomTabScreen/SettingModule/EditProfile';
import ChangePassword from '../screens/BottomTabScreen/SettingModule/ChangePassword';
import NotificationSettings from '../screens/BottomTabScreen/SettingModule/NotificationSettings';
import UpdateInterest from '../screens/BottomTabScreen/SettingModule/UpdateInterest';
import RequestedSessionDetail from '../screens/CoachSessionModule/RequestedSessionDetail';
import SessionRequestedList from '../screens/CoachSessionModule/SessionRequestedList';
import SessionDetails from '../screens/CoachSessionModule/SessionDetail';
import CoachMyProfile from '../screens/BottomTabScreen/SettingModule/CoachMyProfile';
import UpdateCoachingAreas from '../screens/BottomTabScreen/SettingModule/UpdateCoachProfile/UpdateCoachingAreas';
import UpdateLanguages from '../screens/BottomTabScreen/SettingModule/UpdateCoachProfile/UpdateLanguages';
import UpdateAvailability from '../screens/BottomTabScreen/SettingModule/UpdateCoachProfile/UpdateAvailability';
import UpdateSessionDurations from '../screens/BottomTabScreen/SettingModule/UpdateCoachProfile/UpdateSessionDurations';
import EditCoachProfile from '../screens/BottomTabScreen/SettingModule/UpdateCoachProfile/EditCoachProfile';
import BadgesScreen from '../screens/BottomTabScreen/SettingModule/BadgesScreen';
import MyReviewScreen from '../screens/BottomTabScreen/SettingModule/MyReviewScreen';
import ChatScreen from '../screens/BottomTabScreen/ChatModule/ChatScreen';
import MyWallet from '../screens/BottomTabScreen/SettingModule/UpdateCoachProfile/MyWallet';
import Turnovers from '../screens/BottomTabScreen/SettingModule/UpdateCoachProfile/Turnovers';
import WellcoinsScreen from '../screens/MyCoachingModule/WellcoinsScreen';
import WellcoinsDetails from '../screens/CoacheeDashboardModule/WellcoinsDetails';
import PaymentScreen from '../screens/StripePaymentModule/PaymentScreen.android';
import CoacheeBadgesScreen from '../screens/BottomTabScreen/SettingModule/CoacheeBadgesScreen';
import VideoCall from '../screens/VideoSession/VideoCall';
import CoachingDetail from '../screens/CoacheeDashboardModule/UpcomingCompletedCoachingDetails';
import RateTheCoach from '../screens/CoacheeDashboardModule/RateTheCoach';
import ReportUser from '../screens/BottomTabScreen/ChatModule/ReportUser';
import NotificationList from '../screens/NotificationModule/NotificationList';
import TermsAndPrivacyPolicy from '../screens/BottomTabScreen/SettingModule/TermsAndPrivacyPolicy';
import DeleteAccount from '../screens/BottomTabScreen/SettingModule/UpdateCoachProfile/DeleteAccount';
import SearchCoaches from '../screens/CoacheeDashboardModule/SearchCoaches';

const Stack = createStackNavigator();

const DashboardScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={BottomTabNavigator} />
      <Stack.Screen name="CoachesCategory" component={CoachesByCategory} />
      <Stack.Screen name="CoachDetail" component={CoachDetails} />
      <Stack.Screen name="ReviewBooking" component={ReviewBooking} />
      <Stack.Screen name="CoachingList" component={MyCoachingList} />
      <Stack.Screen name="SessionReviewBooking" component={SessionReviewBooking} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="NotificationSetting" component={NotificationSettings} />
      <Stack.Screen name="UpdateInterest" component={UpdateInterest} />
      <Stack.Screen name="RequestedSession" component={RequestedSessionDetail} />
      <Stack.Screen name="SessionRequestedList" component={SessionRequestedList} />
      <Stack.Screen name="SessionDetail" component={SessionDetails} />
      <Stack.Screen name="CoachSettingProfile" component={CoachMyProfile} />
      <Stack.Screen name="UpdateCoachingAreas" component={UpdateCoachingAreas} />
      <Stack.Screen name="UpdateLanguages" component={UpdateLanguages} />
      <Stack.Screen name="UpdateAvailability" component={UpdateAvailability} />
      <Stack.Screen name="UpdateSessionDurations" component={UpdateSessionDurations} />
      <Stack.Screen name="EditCoachProfile" component={EditCoachProfile} />
      <Stack.Screen name="BadgesScreen" component={BadgesScreen} />
      <Stack.Screen name="MyReviews" component={MyReviewScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="MyWallet" component={MyWallet} />
      <Stack.Screen name="Turnovers" component={Turnovers} />
      <Stack.Screen name="WellcoinScreen" component={WellcoinsScreen} />
      <Stack.Screen name="WellcoinsDetails" component={WellcoinsDetails} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="CoacheeBadges" component={CoacheeBadgesScreen} />
      <Stack.Screen name="VideoCall" component={VideoCall} />
      <Stack.Screen name="CoachingDetail" component={CoachingDetail} />
      <Stack.Screen name="RateTheCoach" component={RateTheCoach} />
      <Stack.Screen name="ReportUser" component={ReportUser} />
      <Stack.Screen name="NotificationList" component={NotificationList} />
      <Stack.Screen name="Terms&PrivacyPolicy" component={TermsAndPrivacyPolicy} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
      <Stack.Screen name="SearchCoaches" component={SearchCoaches} />
    </Stack.Navigator>
  );
};

export default DashboardScreens;
