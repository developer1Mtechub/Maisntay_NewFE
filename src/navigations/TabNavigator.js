import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomBottomTabBar from '../components/CustomBottomBar';
import Explore from '../screens/BottomTabScreen/Explore';
import Setting from '../screens/BottomTabScreen/Setting';
import Chat from '../screens/BottomTabScreen/Chat';
import Presentation from '../screens/BottomTabScreen/Presentation';
import { useSelector } from 'react-redux';
import { SOCKET_URL } from '../configs/apiUrl';
import io from 'socket.io-client';
import useCustomTranslation from '../utilities/useCustomTranslation';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { role } = useSelector((state) => state.userLogin)
  const { user_id } = useSelector(state => state.userLogin)
  const [unReadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const { t } = useCustomTranslation();
  const icons = [
    (role === 'coachee') ? require('../assets/images/explore_src_img.png') : require('../assets/images/coach_home_icon.png'),
    require('../assets/images/presentation_src_img.png'),
    require('../assets/images/chat_src_img.png'),
    require('../assets/images/setting_src_img.png'),
  ];

  useEffect(() => {
    const newSocket = io(`${SOCKET_URL}/`, {
      query: { userId: user_id }
    });

    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log('Socket connected tab bar');
    });

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateUnreadCount = (newUnreadCount) => {
      setUnreadCount(newUnreadCount);
    };

    if (socket) {
      socket.on("unread_count", updateUnreadCount);
    }

    return () => {
      if (socket) {
        socket.off("unread_count", updateUnreadCount);
      }
    };

  }, [socket]);

  return (
    <Tab.Navigator tabBar={(props) => <CustomBottomTabBar {...props} icons={icons} chatBadgeCount={unReadCount} />}>
      <Tab.Screen name="Explore" component={Explore}
        options={{
          headerShown: false, title: role === 'coachee' ? t('explore') : t('home'),
        }} />
      <Tab.Screen name="MyCoaching" component={Presentation}
        options={{
          headerShown: false, title: role === 'coachee' ? t('myCoaching') : t('mySession'),
        }} />
      <Tab.Screen name="Chat" component={Chat}
        options={{
          headerShown: false,
          title: t('chat'),
        }} />
      <Tab.Screen name="Setting" component={Setting}
        options={{
          headerShown: false, title: t('setting'),
        }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
