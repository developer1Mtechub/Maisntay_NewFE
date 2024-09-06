import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/onboarding/onboarding';
import RoleSelector from '../screens/Roles/Roles';
import SignIn from '../screens/SignIn/SignInScreen';
import SignUpScreen from '../screens/SignUp/SignUpScreen';
import ForgetPassword from '../screens/forgetPasswordScreen/ForgetPassword';
import VerificationCode from '../screens/verificationScreen/VerificationCode';
import ResetPassword from '../screens/resetPasswordScreen/ResetPassword';
import CoachProfileScreen from '../screens/CoachProfileModule/CoachProfileScreen'
import SelectLanguageScreen from '../screens/CoachProfileModule/SelectLanguage';
import CoachingAreas from '../screens/CoachProfileModule/CoachingAreas';
import AvailabilityScreen from '../screens/CoachProfileModule/SetAvailability';
import SessionDuration from '../screens/CoachProfileModule/SessionDuration';
import GenderSelectionScreen from '../screens/CoacheeProfileModule/GenderSelection';
import CoacheeProfile from '../screens/CoacheeProfileModule/CoacheeProfile';
import CoacheeProfileCompletion from '../screens/CoacheeProfileModule/CoacheeProfileCompletion';
import CoachProfileCompletion from '../screens/CoachProfileModule/CoachProfileCompletion';
import CoacheeCoachingAreas from '../screens/CoacheeProfileModule/CoacheeCoachingAreas';
import CoacheeVerificationScreen from '../screens/CoacheeVerification/CoacheeVerificationScreen';
import CreateStripeAccount from '../screens/StripePaymentModule/CreateStripeAccount';
import { getData } from '../utilities/localStorage';
import colors from '../theme/colors';

const Stack = createStackNavigator();

const AppNavigator = ({isFirstLaunch}) => {

  return (
    <Stack.Navigator
      //initialRouteName={isFirstLaunch ? "SignIn" : "Onboarding"}
      screenOptions={{ headerShown: false }}>
      {!isFirstLaunch && <Stack.Screen name="Onboarding" component={Onboarding} />}
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="RoleSelector" component={RoleSelector} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="VerificationCode" component={VerificationCode} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="CoachProfile" component={CoachProfileScreen} />
      <Stack.Screen name="SelectLanguage" component={SelectLanguageScreen} />
      <Stack.Screen name="CoachingAreas" component={CoachingAreas} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="SessionDuration" component={SessionDuration} />
      <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
      <Stack.Screen name="CoacheeProfile" component={CoacheeProfile} />
      <Stack.Screen name="CoacheeCoachingAreas" component={CoacheeCoachingAreas} />
      <Stack.Screen name="CoacheeProfileCompletion" component={CoacheeProfileCompletion} />
      <Stack.Screen name="CoachProfileCompletion" component={CoachProfileCompletion} />
      <Stack.Screen name="CoacheeVerification" component={CoacheeVerificationScreen} />
      <Stack.Screen name="CreateStripeAccount" component={CreateStripeAccount} />
    </Stack.Navigator>
  );
};


export default AppNavigator;
