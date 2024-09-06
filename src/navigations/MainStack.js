import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import BottomTabNavigator from './TabNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from '../redux/authSlices/userLoginSlice';
import { getData } from '../utilities/localStorage';
import DashboardScreens from './DashboardScreens';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const MainStack = () => {

  const dispatch = useDispatch();
  const token = useSelector(state => state.userLogin.token);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await getData('token');
        const userData = await getData('userData');
        const firstLaunch = await getData('firstLaunch');
        setIsFirstLaunch(firstLaunch);
        setLoading(false);
        if (storedToken) {
          dispatch(resetState({
            token: storedToken,
            role: userData?.user?.role,
            user_name: `${userData?.user?.first_name} ${userData?.user?.last_name}`,
            user_id: userData?.user?.id || userData?.user?.user_id, //TODO check the login id
          }))
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }


  return (
    <NavigationContainer>
      {token ? <DashboardScreens /> : <AppNavigator isFirstLaunch={isFirstLaunch} />}
      {/* {token ? <BottomTabNavigator /> : <AppNavigator /> } */}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
});


export default MainStack;
