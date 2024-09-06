import React, { useEffect, useState, useCallback } from 'react';
import { LogBox, StatusBar, Text, View, StyleSheet } from 'react-native';
import MainStack from './src/navigations/MainStack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from "./src/redux/store";
import NetInfo from "@react-native-community/netinfo";
import fonts from './src/theme/fonts';
import colors from './src/theme/colors';
import { StripeProvider } from '@stripe/stripe-react-native';
import CustomModal from './src/components/CustomModal';
import io from 'socket.io-client';
import { BASE_URL, SOCKET_URL } from './src/configs/apiUrl';
import { getData } from './src/utilities/localStorage';
import CustomSnackbar from './src/components/CustomToast';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
//comment 
const MainApp = () => {
  const dispatch = useDispatch();
  const { role, token } = useSelector((state) => state.userLogin);
  const { user_id } = useSelector((state) => state.userLogin);

  const [isConnected, setConnected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [toastType, setToastType] = useState('');
  const [socket, setSocket] = useState(null);

  const [modalContent, setModalContent] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Ok',
    icon: null,
  });

  useEffect(() => {
    if (user_id) {
      const newSocket = io(SOCKET_URL, {
        query: { userId: user_id }
      });
      setSocket(newSocket)
      newSocket.connect();
      console.log("Connected to socket---> App");
    }

    if (socket) {
      socket.on("coach-start-session", (socketData) => {
        console.log("Socket: ", socketData);
        if (socketData.coachStarted) {
          console.log("Coach has started the session");
          if (role === 'coachee') {
            setModalVisible(true);
            setModalContent({
              title: 'Session Started!',
              subtitle: 'Coach has started the session. Please join the session',
              buttonText: 'Ok',
              icon: require('./src/assets/images/session_start_bell.png'),
            });
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("coach-start-session");
      }

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, role]);



  async function checkForSessionNotifications() {
    try {
      const response = await fetch(`${BASE_URL}/notification-request`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const notificationRequest = await response.json();
      //console.log("notification-request:", notificationRequest?.result, role);

      if (notificationRequest?.result) {

        if (role === "coach") {
          renderSuccessMessage(`You have a new session request from ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`,
            "New Session Request")
          // setModalContent({
          //   title: 'New Session Request',
          //   subtitle: `You have a new session request from  ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`,
          //   buttonText: 'Ok',
          //   // icon: require('./src/assets/images/session_request.png'), // Adjust the path as needed
          // });
          // setModalVisible(true);
        }

        const deleteResponse = await fetch(
          `${BASE_URL}/notification-request/${notificationRequest?.result.id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error('Failed to delete session notification request');
        }
      }
    } catch (error) {
      console.log('Error checking for session notifications:', error);
      // Optionally, you can handle the error more gracefully, e.g., show a user-friendly message
      // showErrorMessage('An error occurred while checking for notifications. Please try again later.');
    }
  }


  async function checkForNotificationsAccepted() {
    try {
      const response = await fetch(`${BASE_URL}/notification-request-accepted`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const notificationRequest = await response.json();
      //console.log("notification-request-accepted:", notificationRequest?.result, role);

      if (notificationRequest?.result) {
        if (role !== "coach") {
          renderSuccessMessage(`${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name} has accepted Your session request.`,
            "Yay! Request Accepted")
          // setModalContent({
          //   title: 'Yay! Request Accepted',
          //   subtitle: `Your session request has been accepted by ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`,
          //   buttonText: 'Ok',
          //   // icon: require('./src/assets/images/request_accepted.png'), // Adjust the path as needed
          // });
          // setModalVisible(true);
        }

        const deleteResponse = await fetch(
          `${BASE_URL}/notification-request-accepted/${notificationRequest?.result.id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error('Failed to delete notification request accepted');
        }
      }
    } catch (error) {
      console.log('Error checking for accepted notifications:', error);
      // Optionally, you can handle the error more gracefully, e.g., show a user-friendly message
      // showErrorMessage('An error occurred while checking for notifications. Please try again later.');
    }
  }

  async function checkForPaymentNotifications() {
    try {
      const response = await fetch(`${BASE_URL}/notification-request-payment`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const notificationRequest = await response.json();
      //console.log("notification-request-payment:", notificationRequest?.result, role);

      if (notificationRequest?.result) {
        if (role === "coach") {
          renderSuccessMessage(`Payment received for session with ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}.`,
            "Payment Received")
          // setModalContent({
          //   title: 'Payment Received',
          //   subtitle: `You have got a new payment from ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`,
          //   buttonText: 'Ok',
          //   // icon: require('./src/assets/images/payment_received.png'), // Adjust the path as needed
          // });
          // setModalVisible(true);
        }

        const deleteResponse = await fetch(
          `${BASE_URL}/notification-request-payment/${notificationRequest?.result.id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error('Failed to delete notification request payment');
        }
      }
    } catch (error) {
      console.log('Error checking for payment notifications:', error);
      // Optionally, you can handle the error more gracefully, e.g., show a user-friendly message
      // showErrorMessage('An error occurred while checking for notifications. Please try again later.');
    }
  }


  async function checkForRatingNotifications() {
    try {
      const response = await fetch(`${BASE_URL}/notification-request-rating`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const notificationRequest = await response.json();
      //console.log("notification-request-rating:", notificationRequest?.result, role);

      if (notificationRequest?.result) {
        if (role === "coach") {
          setModalContent({
            title: 'New Review',
            subtitle: `New review received for your coaching session with ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`,
            buttonText: 'Ok',
            icon: require('./src/assets/images/new_review_received.png'), // Adjust the path as needed
          });
          setModalVisible(true);
        }

        const deleteResponse = await fetch(
          `${BASE_URL}/notification-request-rating/${notificationRequest?.result.id}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error('Failed to delete notification request rating');
        }
      }
    } catch (error) {
      console.log('Error checking for rating notifications:', error);
      // Optionally, you can handle the error more gracefully, e.g., show a user-friendly message
      // showErrorMessage('An error occurred while checking for notifications. Please try again later.');
    }
  }

  useEffect(() => {
    let sessionInterval;
    let notificationsAcceptedInterval;
    let paymentNotificationsInterval;
    let ratingNotificationsInterval;
    if (token) {
      sessionInterval = setInterval(checkForSessionNotifications, 5000);
      notificationsAcceptedInterval = setInterval(checkForNotificationsAccepted, 5000);
      paymentNotificationsInterval = setInterval(checkForPaymentNotifications, 5000);
      ratingNotificationsInterval = setInterval(checkForRatingNotifications, 5000);
    }


    return () => {
      clearInterval(sessionInterval);
      clearInterval(notificationsAcceptedInterval);
      clearInterval(paymentNotificationsInterval);
      clearInterval(ratingNotificationsInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested",
      "ViewPropTypes will be removed from React Native",
      "Task orphaned for request",
      "Sending `onAnimatedValueUpdate` with no listeners registered",
      "Animated: `useNativeDriver` was not specified.",
      "Warning: componentWillMount has been renamed,",
      "Animated.event now requires a second",
      "new NativeEventEmitter()",
      "ReactImageView:",
      "TypeError:Cannot read property"
    ]);
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderNetworkStatus = () => (
    !isConnected && (
      <View style={styles.networkContainerStyle}>
        <Text style={styles.textStyle}>
          You are offline, Check your internet connection.
        </Text>
      </View>
    )
  );

  const renderSuccessMessage = (message, title) => {
    setMessage(title);
    setDescription(message);
    setIsVisible(true);
    setToastType('success');
  };

  const renderToastMessage = () => (
    <CustomSnackbar
      visible={isVisible}
      message={message}
      messageDescription={description}
      onDismiss={() => { setIsVisible(false); }}
      toastType={toastType}
      isPupNoti={true}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {renderNetworkStatus()}
      <MainStack />
      {renderToastMessage()}
      <CustomModal
        isVisible={modalVisible}
        onClose={toggleModal}
        title={modalContent.title}
        subtitle={modalContent.subtitle}
        buttonText={modalContent.buttonText}
        icon={modalContent.icon}
      />
    </View>
  );
};

const App = () => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <MainApp />
    </I18nextProvider>
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  networkContainerStyle: {
    backgroundColor: '#333333',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  textStyle: {
    color: 'white',
    fontFamily: fonts.fontsType.medium,
    fontSize: 14
  },
});

export default App;
